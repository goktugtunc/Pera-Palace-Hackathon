"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, X, ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface UserRegistrationFormProps {
  onClose: () => void
  onRegister: (name: string, surname: string) => Promise<void>
  onBack: () => void
}

export default function UserRegistrationForm({ onClose, onRegister, onBack }: UserRegistrationFormProps) {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"initial" | "registering" | "success">("initial")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !surname.trim()) {
      setError("Ad ve soyad alanları zorunludur.")
      return
    }

    console.log(`📝 Kayıt formu gönderiliyor: ${name} ${surname}`)
    setIsLoading(true)
    setError(null)
    setStep("registering")

    try {
      await onRegister(name.trim(), surname.trim())
      // onRegister başarılı olursa, kullanıcı zaten dashboard'a yönlendirilecek
      setStep("success")
    } catch (err: any) {
      console.error("❌ Kayıt form hatası:", err)
      setError(err.message || "Kayıt işlemi başarısız. Lütfen tekrar deneyin.")
      setStep("initial")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 text-white hover:bg-white/10"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
          {step === "initial" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="absolute left-2 top-2 text-white hover:bg-white/10"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2 mb-2 justify-center">
            <UserPlus className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-white">Kullanıcı Kaydı</CardTitle>
          </div>
          <CardDescription className="text-gray-300 text-center">
            {step === "registering"
              ? "Hesabınız oluşturuluyor..."
              : step === "success"
                ? "Kayıt başarılı!"
                : "Hesabınızı oluşturmak için bilgilerinizi girin"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "registering" && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
              <div className="text-white mb-2">Hesabınız oluşturuluyor...</div>
              <div className="text-sm text-gray-400">Lütfen bekleyin, bu işlem birkaç saniye sürebilir</div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <div className="text-white mb-2">Kayıt başarılı!</div>
              <div className="text-sm text-gray-400">Eğitim paneline yönlendiriliyorsunuz...</div>
            </div>
          )}

          {step === "initial" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Ad *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınızı girin"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname" className="text-white">
                  Soyad *
                </Label>
                <Input
                  id="surname"
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Soyadınızı girin"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !name.trim() || !surname.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Hesap Oluştur
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-400 text-center">
                Hesabınız oluşturulduktan sonra otomatik olarak giriş yapılacak
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
