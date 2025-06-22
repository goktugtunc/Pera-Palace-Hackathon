"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, RotateCcw, Lightbulb } from "lucide-react"

interface FillInTheBlanksGameProps {
  onComplete: (score: number) => void
}

interface Question {
  id: string
  text: string
  blanks: { answer: string; hint?: string }[]
}

export default function FillInTheBlanksGame({ onComplete }: FillInTheBlanksGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [showHints, setShowHints] = useState<boolean[]>([])

  const questions: Question[] = [
    {
      id: "q1",
      text: "Stellar, _____ ve _____ maliyetli ödemeler için tasarlanmış açık kaynaklı bir _____ ağıdır.",
      blanks: [
        { answer: "hızlı", hint: "İşlemler saniyeler içinde tamamlanır" },
        { answer: "düşük", hint: "Ücretler çok az" },
        { answer: "blockchain", hint: "Dağıtık defter teknolojisi" },
      ],
    },
    {
      id: "q2",
      text: "Stellar hesaplarının public key'i _____ harfi ile başlar ve secret key'i _____ harfi ile başlar.",
      blanks: [
        { answer: "G", hint: "Galactic address" },
        { answer: "S", hint: "Secret key identifier" },
      ],
    },
    {
      id: "q3",
      text: "Stellar'ın yerel para birimi _____ olarak adlandırılır ve minimum hesap bakiyesi _____ XLM'dir.",
      blanks: [
        { answer: "XLM", hint: "Stellar Lumens" },
        { answer: "1", hint: "Base reserve miktarı" },
      ],
    },
    {
      id: "q4",
      text: "Native olmayan varlıkları tutmak için _____ oluşturmanız gerekir ve her operasyon için _____ XLM base fee ödenir.",
      blanks: [
        { answer: "trustline", hint: "Güven hattı" },
        { answer: "0.00001", hint: "Çok düşük işlem ücreti" },
      ],
    },
  ]

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const toggleHint = (index: number) => {
    const newShowHints = [...showHints]
    newShowHints[index] = !newShowHints[index]
    setShowHints(newShowHints)
  }

  const checkAnswers = () => {
    let correctCount = 0
    currentQuestion.blanks.forEach((blank, index) => {
      if (answers[index]?.toLowerCase().trim() === blank.answer.toLowerCase()) {
        correctCount++
      }
    })

    if (correctCount === currentQuestion.blanks.length) {
      setScore(score + 1)
    }

    setShowResults(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setAnswers([])
      setShowResults(false)
      setShowHints([])
    } else {
      // Oyun tamamlandı - skoru hesapla ve gönder
      const finalScore = Math.round((score / questions.length) * 100)
      onComplete(finalScore)
    }
  }

  const resetQuestion = () => {
    setAnswers([])
    setShowResults(false)
    setShowHints([])
  }

  const renderQuestionWithBlanks = () => {
    const parts = currentQuestion.text.split("_____")
    const result = []

    for (let i = 0; i < parts.length; i++) {
      result.push(
        <span key={`text-${i}`} className="text-white">
          {parts[i]}
        </span>,
      )

      if (i < parts.length - 1) {
        const isCorrect =
          showResults && answers[i]?.toLowerCase().trim() === currentQuestion.blanks[i].answer.toLowerCase()
        const isIncorrect =
          showResults && answers[i]?.toLowerCase().trim() !== currentQuestion.blanks[i].answer.toLowerCase()

        result.push(
          <span key={`blank-${i}`} className="inline-flex items-center gap-2 mx-1">
            <Input
              value={answers[i] || ""}
              onChange={(e) => handleAnswerChange(i, e.target.value)}
              disabled={showResults}
              className={`
                inline-block w-32 h-8 text-center bg-white/10 border-white/20 text-white
                ${isCorrect ? "border-green-400 bg-green-400/20" : ""}
                ${isIncorrect ? "border-red-400 bg-red-400/20" : ""}
              `}
              placeholder="?"
            />
            {showResults && isCorrect && <CheckCircle className="h-4 w-4 text-green-400" />}
            {showResults && isIncorrect && <X className="h-4 w-4 text-red-400" />}
            {!showResults && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleHint(i)}
                className="h-6 w-6 p-0 text-yellow-400 hover:bg-yellow-400/20"
              >
                <Lightbulb className="h-3 w-3" />
              </Button>
            )}
          </span>,
        )
      }
    }

    return result
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Boşluk Doldurma Oyunu</CardTitle>
          <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
            {currentQuestionIndex + 1} / {questions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Soru */}
        <div className="bg-white/5 p-6 rounded-lg">
          <div className="text-lg leading-relaxed">{renderQuestionWithBlanks()}</div>
        </div>

        {/* İpuçları */}
        {showHints.some((show) => show) && (
          <div className="space-y-2">
            <h4 className="text-white font-medium">İpuçları:</h4>
            {showHints.map(
              (show, index) =>
                show && (
                  <div key={index} className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-lg">
                    <div className="text-yellow-300 text-sm">
                      <strong>Boşluk {index + 1}:</strong> {currentQuestion.blanks[index].hint}
                    </div>
                  </div>
                ),
            )}
          </div>
        )}

        {/* Sonuçlar */}
        {showResults && (
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">Doğru Cevaplar:</h4>
            <div className="space-y-2">
              {currentQuestion.blanks.map((blank, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-300">Boşluk {index + 1}:</span>
                  <span className="text-green-400 font-medium">{blank.answer}</span>
                  {answers[index]?.toLowerCase().trim() === blank.answer.toLowerCase() ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <X className="h-4 w-4 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kontroller */}
        <div className="flex justify-between items-center">
          <div className="text-white">
            <span className="text-sm text-gray-300">Skor: </span>
            <span className="font-bold">
              {score} / {questions.length}
            </span>
          </div>

          <div className="flex gap-2">
            {!showResults ? (
              <>
                <Button
                  variant="outline"
                  onClick={resetQuestion}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sıfırla
                </Button>
                <Button
                  onClick={checkAnswers}
                  disabled={answers.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Kontrol Et
                </Button>
              </>
            ) : (
              <Button
                onClick={nextQuestion}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {currentQuestionIndex === questions.length - 1 ? "Tamamla" : "Sonraki Soru"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
