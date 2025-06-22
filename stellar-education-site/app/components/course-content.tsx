"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, Play, BookOpen, Trophy } from "lucide-react"
import FillInTheBlanksGame from "./games/fill-in-the-blanks"
import DragDropGame from "./games/drag-drop-game"
import QuizGame from "./games/quiz-game"
import MatchingGame from "./games/matching-game"
import CourseCompletionModal from "./course-completion-modal"

interface CourseContentProps {
  courseId: string
  onBack: () => void
  onComplete: (successRate?: number) => void
}

interface Module {
  id: string
  title: string
  type: "lesson" | "game" | "quiz"
  gameType?: "fill-blanks" | "drag-drop" | "quiz" | "matching"
  content?: string
  completed: boolean
}

export default function CourseContent({ courseId, onBack, onComplete }: CourseContentProps) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [gameScores, setGameScores] = useState<{ [moduleId: string]: number }>({})
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [finalSuccessRate, setFinalSuccessRate] = useState(0)

  const modules: Module[] = [
    {
      id: "intro",
      title: "Stellar Nedir?",
      type: "lesson",
      content: `
        Stellar, hızlı ve düşük maliyetli ödemeler için tasarlanmış açık kaynaklı bir blockchain ağıdır.
        
        **Temel Özellikler:**
        • Saniyeler içinde işlem onayı
        • Çok düşük işlem ücretleri (0.00001 XLM)
        • Çoklu para birimi desteği
        • Merkezi olmayan borsa (DEX) entegrasyonu
        
        Stellar, özellikle sınır ötesi ödemeler ve finansal kapsayıcılık için optimize edilmiştir.
      `,
      completed: false,
    },
    {
      id: "fill-blanks-1",
      title: "Stellar Terimler - Boşluk Doldurma",
      type: "game",
      gameType: "fill-blanks",
      completed: false,
    },
    {
      id: "accounts",
      title: "Stellar Hesapları",
      type: "lesson",
      content: `
        Stellar ağında her hesap benzersiz bir public key ile tanımlanır.
        
        **Hesap Özellikleri:**
        • Public Key: Hesabın adresi (G ile başlar)
        • Secret Key: Hesabın özel anahtarı (S ile başlar)
        • Minimum Bakiye: 1 XLM (base reserve)
        • Sequence Number: İşlem sıralaması için
        
        **Güvenlik:**
        Secret key'inizi asla paylaşmayın ve güvenli bir yerde saklayın.
      `,
      completed: false,
    },
    {
      id: "drag-drop-1",
      title: "Stellar Bileşenleri - Sürükle Bırak",
      type: "game",
      gameType: "drag-drop",
      completed: false,
    },
    {
      id: "assets",
      title: "Stellar Varlıkları (Assets)",
      type: "lesson",
      content: `
        Stellar ağında farklı türde varlıklar bulunabilir.
        
        **Varlık Türleri:**
        • Native Asset: XLM (Stellar'ın yerel para birimi)
        • Credit Assets: Diğer tokenlar (USD, EUR, BTC vb.)
        • Custom Assets: Özel oluşturulan tokenlar
        
        **Trustlines:**
        Native olmayan varlıkları tutmak için trustline oluşturmanız gerekir.
      `,
      completed: false,
    },
    {
      id: "quiz-1",
      title: "Stellar Bilgi Testi",
      type: "game",
      gameType: "quiz",
      completed: false,
    },
    {
      id: "transactions",
      title: "Stellar İşlemleri",
      type: "lesson",
      content: `
        Stellar'da işlemler operations (operasyonlar) içerir.
        
        **Yaygın Operasyonlar:**
        • Payment: Ödeme gönderme
        • Create Account: Yeni hesap oluşturma
        • Change Trust: Trustline oluşturma/değiştirme
        • Manage Offer: DEX'te emir verme
        
        **İşlem Ücretleri:**
        Her operasyon için 0.00001 XLM base fee ödenir.
      `,
      completed: false,
    },
    {
      id: "matching-1",
      title: "Kavram Eşleştirme Oyunu",
      type: "game",
      gameType: "matching",
      completed: false,
    },
  ]

  const currentModule = modules[currentModuleIndex]
  const progress = (completedModules.length / modules.length) * 100

  const handleModuleComplete = (score?: number) => {
    // Eğer oyun modülüyse skoru kaydet
    if (currentModule.type === "game" && score !== undefined) {
      setGameScores((prev) => ({
        ...prev,
        [currentModule.id]: score,
      }))
    }

    if (!completedModules.includes(currentModule.id)) {
      setCompletedModules([...completedModules, currentModule.id])
    }

    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    } else {
      // Kurs tamamlandı - başarı oranını hesapla
      calculateFinalScore()
    }
  }

  const calculateFinalScore = () => {
    const gameModules = modules.filter((m) => m.type === "game")

    if (gameModules.length === 0) {
      setFinalSuccessRate(100)
      setShowCompletionModal(true)
      return
    }

    // Her oyun modülünden alınan skorları topla
    let totalScore = 0
    let gameCount = 0

    gameModules.forEach((module) => {
      const score = gameScores[module.id]
      if (score !== undefined) {
        totalScore += score
        gameCount++
      }
    })

    // Ortalama skoru hesapla
    const averageScore = gameCount > 0 ? Math.round(totalScore / gameCount) : 0
    setFinalSuccessRate(averageScore)
    setShowCompletionModal(true)
  }

  const handleNext = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
    }
  }

  const renderGameContent = () => {
    switch (currentModule.gameType) {
      case "fill-blanks":
        return <FillInTheBlanksGame onComplete={(score) => handleModuleComplete(score)} />
      case "drag-drop":
        return <DragDropGame onComplete={(score) => handleModuleComplete(score)} />
      case "quiz":
        return <QuizGame onComplete={(score) => handleModuleComplete(score)} />
      case "matching":
        return <MatchingGame onComplete={(score) => handleModuleComplete(score)} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Stellar Blockchain Temelleri</h1>
              <p className="text-sm text-gray-300">
                Modül {currentModuleIndex + 1} / {modules.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-300">İlerleme</div>
              <div className="text-lg font-bold text-white">{Math.round(progress)}%</div>
            </div>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {currentModule.type === "lesson" && <BookOpen className="h-6 w-6 text-blue-400" />}
            {currentModule.type === "game" && <Play className="h-6 w-6 text-purple-400" />}
            {currentModule.type === "quiz" && <Trophy className="h-6 w-6 text-yellow-400" />}
            <h2 className="text-2xl font-bold text-white">{currentModule.title}</h2>
            {completedModules.includes(currentModule.id) && (
              <Badge className="bg-green-600/20 text-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Tamamlandı
              </Badge>
            )}
          </div>

          {/* Module Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {modules.map((module, index) => (
              <Button
                key={module.id}
                variant={index === currentModuleIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentModuleIndex(index)}
                className={`
                  min-w-fit whitespace-nowrap
                  ${
                    index === currentModuleIndex
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }
                  ${completedModules.includes(module.id) ? "ring-2 ring-green-400/50" : ""}
                `}
              >
                {completedModules.includes(module.id) && <CheckCircle className="h-3 w-3 mr-1" />}
                {index + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentModule.type === "lesson" ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">{currentModule.content}</div>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentModuleIndex === 0}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Önceki
                  </Button>
                  <Button
                    onClick={() => handleModuleComplete()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {currentModuleIndex === modules.length - 1 ? "Kursu Tamamla" : "Devam Et"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            renderGameContent()
          )}
        </div>
      </div>
      {/* Course Completion Modal */}
      {showCompletionModal && (
        <CourseCompletionModal
          successRate={finalSuccessRate}
          courseTitle="Stellar Blockchain Temelleri"
          onClose={() => {
            setShowCompletionModal(false)
            onComplete(finalSuccessRate) // Başarı oranını gönder
          }}
        />
      )}
    </div>
  )
}
