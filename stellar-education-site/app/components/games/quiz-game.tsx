"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, RotateCcw } from "lucide-react"

interface QuizGameProps {
  onComplete: (score: number) => void
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export default function QuizGame({ onComplete }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([])

  const questions: Question[] = [
    {
      id: "q1",
      question: "Stellar ağında minimum hesap bakiyesi kaç XLM'dir?",
      options: ["0.5 XLM", "1 XLM", "2 XLM", "5 XLM"],
      correctAnswer: 1,
      explanation: "Stellar'da her hesap minimum 1 XLM (base reserve) tutmak zorundadır.",
    },
    {
      id: "q2",
      question: "Stellar'da işlem ücretleri nasıl hesaplanır?",
      options: [
        "İşlem miktarının %1'i",
        "Sabit 0.1 XLM",
        "Her operasyon için 0.00001 XLM",
        "Ağ yoğunluğuna göre değişken",
      ],
      correctAnswer: 2,
      explanation: "Stellar'da her operasyon için sabit 0.00001 XLM base fee ödenir.",
    },
    {
      id: "q3",
      question: "Stellar Consensus Protocol'ün temel özelliği nedir?",
      options: [
        "Proof of Work kullanır",
        "Proof of Stake kullanır",
        "Federated Byzantine Agreement kullanır",
        "Delegated Proof of Stake kullanır",
      ],
      correctAnswer: 2,
      explanation: "Stellar, Federated Byzantine Agreement (FBA) konsensüs mekanizması kullanır.",
    },
    {
      id: "q4",
      question: "Trustline nedir?",
      options: [
        "İki hesap arasındaki güven ilişkisi",
        "Native olmayan varlıkları tutmak için gerekli izin",
        "İşlem onaylama mekanizması",
        "Hesap güvenlik protokolü",
      ],
      correctAnswer: 1,
      explanation:
        "Trustline, native olmayan varlıkları (XLM dışındaki tokenlar) tutabilmek için oluşturulan güven hattıdır.",
    },
    {
      id: "q5",
      question: "Stellar'da public key hangi harf ile başlar?",
      options: ["S", "G", "X", "P"],
      correctAnswer: 1,
      explanation: "Stellar public key'leri 'G' harfi ile başlar (Galactic address).",
    },
  ]

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    if (isCorrect) {
      setScore(score + 1)
    }

    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestionIndex] = true
    setAnsweredQuestions(newAnsweredQuestions)

    setShowResult(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // Quiz tamamlandı - skoru hesapla ve gönder
      const finalScore = Math.round((score / questions.length) * 100)
      onComplete(finalScore)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnsweredQuestions([])
  }

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return "text-green-400"
    if (percentage >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Stellar Bilgi Testi</CardTitle>
          <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
            {currentQuestionIndex + 1} / {questions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* İlerleme */}
        <div className="flex gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`
                h-2 flex-1 rounded
                ${index < currentQuestionIndex ? "bg-green-400" : ""}
                ${index === currentQuestionIndex ? "bg-purple-400" : ""}
                ${index > currentQuestionIndex ? "bg-white/20" : ""}
              `}
            />
          ))}
        </div>

        {/* Soru */}
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-white text-lg font-medium mb-4">{currentQuestion.question}</h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = showResult && index === currentQuestion.correctAnswer
              const isIncorrect = showResult && isSelected && index !== currentQuestion.correctAnswer

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`
                    w-full text-left p-4 rounded-lg border transition-all
                    ${!showResult && isSelected ? "border-purple-400 bg-purple-400/20" : "border-white/20"}
                    ${!showResult && !isSelected ? "hover:border-white/40 hover:bg-white/10" : ""}
                    ${isCorrect ? "border-green-400 bg-green-400/20" : ""}
                    ${isIncorrect ? "border-red-400 bg-red-400/20" : ""}
                    ${showResult ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">{option}</span>
                    {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-400" />}
                    {showResult && isIncorrect && <X className="h-5 w-5 text-red-400" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Açıklama */}
        {showResult && (
          <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-lg">
            <h4 className="text-blue-300 font-medium mb-2">Açıklama:</h4>
            <p className="text-blue-200 text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Kontroller */}
        <div className="flex justify-between items-center">
          <div className="text-white">
            <span className="text-sm text-gray-300">Skor: </span>
            <span className={`font-bold ${getScoreColor()}`}>
              {score} / {questions.length}
            </span>
          </div>

          <div className="flex gap-2">
            {!showResult ? (
              <>
                <Button
                  variant="outline"
                  onClick={resetQuiz}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sıfırla
                </Button>
                <Button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Cevapla
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
