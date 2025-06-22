"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Sparkles } from "lucide-react"
import { X } from "lucide-react"

interface CourseCompletionModalProps {
  successRate: number
  courseTitle: string
  onClose: () => void
}

export default function CourseCompletionModal({ successRate, courseTitle, onClose }: CourseCompletionModalProps) {
  const isExcellent = successRate >= 80
  const isPassed = successRate >= 80

  const getGradeInfo = () => {
    if (isExcellent) {
      return {
        grade: "Mükemmel",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/20",
        borderColor: "border-yellow-400/30",
        icon: Trophy,
        message: "Tebrikler! Stellar blockchain konusunda gerçekten uzmanlaştın! 🎉",
        description: "Bu başarı oranı ile blockchain dünyasında kendine güvenle yer açabilirsin.",
        passed: true,
      }
    } else {
      return {
        grade: "Başarısız",
        color: "text-red-400",
        bgColor: "bg-red-400/20",
        borderColor: "border-red-400/30",
        icon: X,
        message: "Maalesef kursu geçemedin. Ancak vazgeçme! 💪",
        description:
          "Başarılı olmak için en az %80 puan alman gerekiyor. Konuları tekrar ederek yeniden deneyebilirsin.",
        passed: false,
      }
    }
  }

  const gradeInfo = getGradeInfo()
  const IconComponent = gradeInfo.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-md bg-white/10 border-white/20 backdrop-blur-md ${gradeInfo.borderColor}`}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className={`p-3 rounded-full ${gradeInfo.bgColor}`}>
              <IconComponent className={`h-8 w-8 ${gradeInfo.color}`} />
            </div>
          </div>
          <CardTitle className="text-xl text-white mb-1">
            {gradeInfo.passed ? "Kurs Tamamlandı!" : "Kurs Başarısız"}
          </CardTitle>
          <div className="text-sm text-gray-300">{courseTitle}</div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* Başarı Oranı */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="text-4xl font-bold text-white mb-1">%{successRate}</div>
              {isExcellent && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
              )}
            </div>
            <Badge className={`${gradeInfo.bgColor} ${gradeInfo.color} border-0 px-3 py-1`}>{gradeInfo.grade}</Badge>
          </div>

          {/* Mesaj */}
          <div className={`${gradeInfo.bgColor} ${gradeInfo.borderColor} border p-3 rounded-lg text-center`}>
            <div className={`${gradeInfo.color} font-medium mb-1 text-sm`}>{gradeInfo.message}</div>
            <div className="text-gray-300 text-xs">{gradeInfo.description}</div>
          </div>

          {/* Geçme Kriteri */}
          <div className="bg-white/5 p-3 rounded-lg">
            <h4 className="text-white font-medium mb-2 text-sm">Geçme Kriteri:</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Minimum Başarı:</span>
                <span className="text-yellow-400 font-bold">%80</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Senin Skorun:</span>
                <span className={`font-bold ${gradeInfo.color}`}>%{successRate}</span>
              </div>
            </div>
          </div>

          {/* Başarı Rozetleri */}
          {isExcellent && (
            <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-300 font-medium text-sm">Özel Rozet Kazandın!</span>
              </div>
              <div className="text-xs text-yellow-200">"Stellar Uzmanı" rozetin dashboard'ında görünecek</div>
            </div>
          )}

          {/* Sonraki Adımlar */}
          <div className="bg-white/5 p-3 rounded-lg">
            <h4 className="text-white font-medium mb-2 text-sm">
              {gradeInfo.passed ? "Sonraki Adımlar:" : "Tekrar Denemek İçin:"}
            </h4>
            <ul className="text-xs text-gray-300 space-y-1">
              {gradeInfo.passed ? (
                <>
                  <li>• Stellar Smart Contracts kursuna geç</li>
                  <li>• Pratik projeler ile deneyim kazan</li>
                  <li>• Topluluk etkinliklerine katıl</li>
                </>
              ) : (
                <>
                  <li>• Ders notlarını tekrar gözden geçir</li>
                  <li>• Oyunları tekrar oynayarak pratik yap</li>
                  <li>• Anlamadığın konuları araştır</li>
                </>
              )}
            </ul>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-2"
          >
            {gradeInfo.passed ? "Dashboard'a Dön" : "Tekrar Dene"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
