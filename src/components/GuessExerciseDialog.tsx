import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGuessExercise, useCheckGuessExercise } from "@/hooks/useLanguage"

type GuessExerciseDialogProps = {
    open: boolean
    setOpen: (open: boolean) => void
}

const QUESTIONS_PER_SESSION = 5

export default function GuessExerciseDialog({ open, setOpen }: GuessExerciseDialogProps) {
    const [step, setStep] = useState(0)
    const [answer, setAnswer] = useState<string | null>(null)
    const [showConfirm, setShowConfirm] = useState(false)
    const [score, setScore] = useState(0)
    const [checking, setChecking] = useState(false)
    const [sessionFinished, setSessionFinished] = useState(false)

    const {
        data: exerciseData,
        refetch: refetchExercise,
        isFetching: isFetchingExercise,
        error: fetchError,
    } = useGuessExercise()

    const checkMutation = useCheckGuessExercise()

    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setStep(0)
                setAnswer(null)
                setShowConfirm(false)
                setScore(0)
                setSessionFinished(false)
            }, 200)
        }
    }, [open])

    const handleOptionClick = (idx: string) => {
        setAnswer(idx)
    }

    const handleNext = async () => {
        if (answer === null || checking) return

        setChecking(true)

        try {
            const payload = { content: exerciseData!.testItem, answer }
            const result = await checkMutation.mutateAsync(payload)

            if (result.ok) setScore(s => s + 1)

            if (step === QUESTIONS_PER_SESSION - 1) {
                setSessionFinished(true)
            } else {
                refetchExercise()
            }

            setStep(s => s + 1)
            setAnswer(null)
        } catch (err) {
            console.error(err)
        } finally {
            setChecking(false)
        }
    }

    const handleFinish = () => {
        setOpen(false)
    }

    const handleClose = (nextOpen: boolean) => {
        if (!nextOpen && step < QUESTIONS_PER_SESSION && (step > 0)) {
            setShowConfirm(true)
        } else {
            setOpen(nextOpen)
        }
    }

    const handleConfirmClose = () => {
        setShowConfirm(false)
        setOpen(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogTitle>
                        {sessionFinished ? "Exercise Result" : `Question ${step + 1} of ${QUESTIONS_PER_SESSION}`}
                    </DialogTitle>
                    <div className="flex flex-col items-center justify-center min-h-[180px]">
                        {sessionFinished ? (
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="text-2xl font-bold">Your score: {score} / {QUESTIONS_PER_SESSION}</div>
                                <Button onClick={handleFinish} className="mt-4 w-40">Finish</Button>
                            </div>
                        ) : isFetchingExercise ? (
                            <div className="text-center text-muted-foreground">Loading question...</div>
                        ) : fetchError ? (
                            <div className="text-center text-destructive mb-4">{fetchError.message}</div>
                        ) : exerciseData ? (
                            <>
                                <div className="text-lg font-medium text-center mb-8 min-h-[48px] flex items-center justify-center">
                                    {exerciseData.testItem}
                                </div>
                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    {exerciseData.options.map((opt: string, idx: number) => (
                                        <Button
                                            key={idx}
                                            type="button"
                                            variant={answer === opt ? "secondary" : "outline"}
                                            className="rounded-xl py-4 text-base font-normal transition-all"
                                            onClick={() => handleOptionClick(opt)}
                                            disabled={checking}
                                        >
                                            {opt}
                                        </Button>
                                    ))}
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={answer === null || checking}
                                        className="mt-6 w-40"
                                    >
                                        {step === QUESTIONS_PER_SESSION - 1 ? "Finish" : "Next"}
                                    </Button>
                                </DialogFooter>
                            </>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
            {/* Confirmation Dialog for closing early */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <div className="text-muted-foreground text-sm mb-4">
                        Your progress will be lost. Do you want to close the exercise?
                    </div>
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleConfirmClose}>Yes, close</Button>
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
