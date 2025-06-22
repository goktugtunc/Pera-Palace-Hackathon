"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, BookOpen, Code, Zap, Star, ArrowRight } from "lucide-react"
import LoginModal from "./components/login-modal"
import Dashboard from "./components/dashboard"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [walletCode, setWalletCode] = useState<string | null>(null)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  const handleLogin = (code: string, token: string, name: string) => {
    setWalletCode(code)
    setUserToken(token)
    setUserName(name)
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  if (isLoggedIn) {
    return <Dashboard walletCode={walletCode} userToken={userToken} userName={userName} />
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
          <Button
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Giriş Yap
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500/30">
            Blockchain Eğitim Platformu
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Stellar ve Web3
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Dünyasını Keşfet
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Blockchain teknolojisini öğren, Stellar ağında geliştirme yap ve Web3'ün geleceğini şekillendir. Flash
            bellek tabanlı güvenli kimlik doğrulama ile hemen başla.
          </p>
          <Button
            size="lg"
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
          >
            Eğitime Başla
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4">Neden Stellar Academy?</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Modern blockchain teknolojilerini öğrenmek için ihtiyacınız olan her şey burada
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Kapsamlı Eğitim</CardTitle>
              <CardDescription className="text-gray-300">
                Temel blockchain kavramlarından ileri seviye Stellar geliştirmeye kadar
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Code className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Pratik Projeler</CardTitle>
              <CardDescription className="text-gray-300">
                Gerçek dünya projeleri ile öğrendiklerini uygula
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Güvenli Giriş</CardTitle>
              <CardDescription className="text-gray-300">
                Flash bellek tabanlı wallet kimlik doğrulama sistemi
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">1000+</div>
            <div className="text-gray-300">Aktif Öğrenci</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
            <div className="text-gray-300">Eğitim Modülü</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">95%</div>
            <div className="text-gray-300">Memnuniyet Oranı</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 backdrop-blur-sm max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-white mb-4">Blockchain Yolculuğuna Başla</CardTitle>
            <CardDescription className="text-gray-300 text-lg mb-6">
              Flash belleğinle güvenli giriş yap ve Stellar ekosisteminde uzman ol
            </CardDescription>
            <Button
              size="lg"
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Hemen Başla
            </Button>
          </CardHeader>
        </Card>
      </section>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
    </div>
  )
}
