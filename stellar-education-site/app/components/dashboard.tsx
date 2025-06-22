"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, BookOpen, Trophy, Play, CheckCircle, Lock, Wallet, LogOut, BarChart3, User } from "lucide-react"
import CourseContent from "./course-content"

interface DashboardProps {
  walletCode: string | null
  userToken: string | null
  userName: string | null
}

export default function Dashboard({ walletCode, userToken, userName }: DashboardProps) {
  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const [currentCourse, setCurrentCourse] = useState<string | null>(null)
  const [courses, setCourses] = useState([
    {
      id: "stellar-basics",
      title: "Stellar Blockchain Temelleri",
      description: "Stellar ağının temel kavramları ve çalışma prensibi",
      duration: "2 saat",
      level: "Başlangıç",
      progress: 0,
      modules: 8,
    },
    {
      id: "smart-contracts",
      title: "Stellar Smart Contracts",
      description: "Soroban ile akıllı kontrat geliştirme",
      duration: "4 saat",
      level: "Orta",
      progress: 0,
      modules: 12,
    },
    {
      id: "web3-integration",
      title: "Web3 Entegrasyonu",
      description: "Stellar ağını web uygulamalarına entegre etme",
      duration: "3 saat",
      level: "İleri",
      progress: 0,
      modules: 10,
    },
    {
      id: "defi-development",
      title: "DeFi Protokol Geliştirme",
      description: "Stellar üzerinde DeFi uygulamaları oluşturma",
      duration: "5 saat",
      level: "İleri",
      progress: 0,
      modules: 15,
    },
  ])

  const achievements = [
    { id: 1, title: "İlk Adım", description: "İlk kursu tamamladın", earned: false },
    { id: 2, title: "Kod Ustası", description: "5 pratik proje tamamladın", earned: false },
    { id: 3, title: "Blockchain Uzmanı", description: "Tüm temel kursları bitirdin", earned: false },
  ]

  const handleLogout = () => {
    console.log("🚪 Çıkış yapılıyor...")
    localStorage.removeItem("stellar_user_token")
    localStorage.removeItem("stellar_user_name")
    window.location.reload()
  }

  const handleCourseStart = (courseId: string) => {
    if (courseId === "stellar-basics") {
      setCurrentCourse(courseId)
    } else {
      // Diğer kurslar için "Çok yakında" mesajı göster
      alert("🚧 Bu kurs çok yakında açılacak! Şu an sadece 'Stellar Blockchain Temelleri' kursu aktif.")
    }
  }

  const handleCourseComplete = (successRate?: number) => {
    // Sadece %80 ve üzeri başarı oranında kursu tamamlanmış say
    if (successRate && successRate >= 80) {
      if (currentCourse && !completedCourses.includes(currentCourse)) {
        setCompletedCourses([...completedCourses, currentCourse])

        // Kurs tamamlandığında progress'i %100 yap
        const updatedCourses = courses.map((course) =>
          course.id === currentCourse ? { ...course, progress: 100 } : course,
        )
        setCourses(updatedCourses)
      }
    }
    setCurrentCourse(null)
  }

  const handleBackToDashboard = () => {
    setCurrentCourse(null)
  }

  if (currentCourse) {
    return <CourseContent courseId={currentCourse} onBack={handleBackToDashboard} onComplete={handleCourseComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">Stellar Academy</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <User className="h-4 w-4" />
              <span className="text-sm">{userName}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">Wallet: {walletCode?.substring(0, 8)}...</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Hoş geldin, {userName?.split(" ")[0]}! 👋</h2>
          <p className="text-gray-300">Stellar blockchain yolculuğuna devam etmeye hazır mısın?</p>
        </div>

        <Tabs defaultValue="courses" className="space-y-8">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="courses" className="data-[state=active]:bg-white/20">
              <BookOpen className="h-4 w-4 mr-2" />
              Kurslar
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-white/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              İlerleme
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-white/20">
              <Trophy className="h-4 w-4 mr-2" />
              Başarımlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Eğitim Kursları</h3>
              <p className="text-gray-300 mb-8">
                Stellar blockchain ve Web3 teknolojilerini öğrenmek için tasarlanmış kapsamlı kurslar
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        {completedCourses.includes(course.id) && (
                          <Badge className="bg-green-600/20 text-green-300 border-green-500/30 mb-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Tamamlandı
                          </Badge>
                        )}
                        <CardTitle className="text-white mb-2">{course.title}</CardTitle>
                        <CardDescription className="text-gray-300">{course.description}</CardDescription>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`
                          ${course.level === "Başlangıç" ? "bg-green-600/20 text-green-300" : ""}
                          ${course.level === "Orta" ? "bg-yellow-600/20 text-yellow-300" : ""}
                          ${course.level === "İleri" ? "bg-red-600/20 text-red-300" : ""}
                        `}
                      >
                        {course.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <span>{course.modules} modül</span>
                        <span>{course.duration}</span>
                      </div>

                      <Progress value={course.progress} className="h-2" />

                      <Button
                        onClick={() => handleCourseStart(course.id)}
                        disabled={course.id !== "stellar-basics"}
                        className={`w-full ${
                          course.id === "stellar-basics"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            : "bg-gray-600 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {course.id === "stellar-basics" ? (course.progress > 0 ? "Yeniden Başla" : "Başla") : "Çok Yakında"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Öğrenme İlerlemen</h3>
              <p className="text-gray-300 mb-8">Kurs tamamlama durumun ve genel ilerleme istatistiklerin</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-purple-400">{completedCourses.length}/4</CardTitle>
                  <CardDescription className="text-gray-300">Tamamlanan Kurs</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-blue-400">0</CardTitle>
                  <CardDescription className="text-gray-300">Toplam Saat</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-yellow-400">0</CardTitle>
                  <CardDescription className="text-gray-300">Kazanılan Puan</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Kurs İlerlemeleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">{course.title}</span>
                      <span className="text-gray-300">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Başarımlar</h3>
              <p className="text-gray-300 mb-8">Öğrenme yolculuğunda kazandığın rozetler ve başarımlar</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`bg-white/5 border-white/10 backdrop-blur-sm ${
                    achievement.earned ? "ring-2 ring-yellow-400/50" : "opacity-60"
                  }`}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 ${achievement.earned ? "text-yellow-400" : "text-gray-500"}`}>
                      <Trophy className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-white">{achievement.title}</CardTitle>
                    <CardDescription className="text-gray-300">{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    {achievement.earned ? (
                      <Badge className="bg-yellow-600/20 text-yellow-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Kazanıldı
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-600/20 text-gray-400">
                        <Lock className="h-3 w-3 mr-1" />
                        Kilitli
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
