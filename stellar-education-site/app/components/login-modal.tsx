"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, X, Loader2, AlertCircle, CheckCircle, FileText, FolderOpen, HardDrive } from "lucide-react"
import UserRegistrationForm from "./user-registration-form"

interface LoginModalProps {
  onClose: () => void
  onLogin: (walletCode: string, userToken: string, userName: string) => void
}

interface ApiResponse {
  name: string | null
  surname: string | null
  token: string | null
  status: string
}

interface CreateUserResponse {
  message: string
  user: {
    name: string
    surname: string
    token: string
    public_key: string
  }
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<
    | "initial"
    | "requesting-access"
    | "checking-drive"
    | "checking-wallet"
    | "creating-wallet"
    | "validating"
    | "registration"
    | "success"
  >("initial")
  const [driveHandle, setDriveHandle] = useState<any>(null)
  const [walletCode, setWalletCode] = useState<string>("")
  const [driveName, setDriveName] = useState<string>("")

  const handleLogin = async () => {
    console.log("🚀 Flash bellek erişimi başlatılıyor...")
    setIsLoading(true)
    setError(null)
    setStep("requesting-access")

    try {
      await requestFlashDriveAccess()
    } catch (err: any) {
      console.error("💥 Hata:", err)
      if (err.name === "AbortError") {
        setError("Flash bellek seçimi iptal edildi.")
      } else if (err.name === "NotAllowedError") {
        setError("Flash bellek erişimi reddedildi. Lütfen izin verin.")
      } else {
        setError("Flash bellek erişimi sırasında hata oluştu: " + err.message)
      }
      setStep("initial")
      setIsLoading(false)
    }
  }

  const requestFlashDriveAccess = async () => {
    try {
      console.log("📁 Flash bellek erişimi isteniyor...")

      if (!("showDirectoryPicker" in window)) {
        throw new Error("Tarayıcınız dosya sistemi erişimini desteklemiyor. Chrome veya Edge kullanın.")
      }

      setStep("checking-drive")

      // Kullanıcıdan flash bellek kök dizinini seçmesini iste
      const directoryHandle = await (window as any).showDirectoryPicker({
        mode: "readwrite",
        startIn: "desktop",
      })

      console.log(`📂 Seçilen dizin: ${directoryHandle.name}`)
      setDriveName(directoryHandle.name || "Flash Bellek")

      // Flash bellek olup olmadığını kontrol et
      await validateFlashDrive(directoryHandle)
    } catch (err: any) {
      console.error("❌ Flash bellek erişim hatası:", err)
      throw err
    }
  }

  const validateFlashDrive = async (directoryHandle: any) => {
    try {
      console.log("🔍 Flash bellek doğrulanıyor...")

      // Dizin içeriğini kontrol et
      const entries = []
      for await (const [name, handle] of directoryHandle.entries()) {
        entries.push({ name, kind: handle.kind })
      }

      console.log("📋 Dizin içeriği:", entries)

      // Flash bellek tipik özellikleri kontrol et
      const hasSystemFiles = entries.some(
        (entry) =>
          entry.name.includes("System Volume Information") ||
          entry.name.includes("$RECYCLE.BIN") ||
          entry.name.includes(".Trash") ||
          entry.name.includes("RECYCLER"),
      )

      const isEmpty = entries.length === 0
      const hasOnlyUserFiles = entries.every((entry) => !entry.name.startsWith(".") && !entry.name.startsWith("$"))

      console.log(
        `📊 Analiz: Sistem dosyaları=${hasSystemFiles}, Boş=${isEmpty}, Kullanıcı dosyaları=${hasOnlyUserFiles}`,
      )

      // Flash bellek olarak kabul et (çok kısıtlayıcı olmayalım)
      if (hasSystemFiles || isEmpty || hasOnlyUserFiles) {
        console.log("✅ Flash bellek olarak kabul edildi!")
        setDriveHandle(directoryHandle)
        setStep("checking-wallet")
        await checkWalletInDrive(directoryHandle)
      } else {
        console.log("⚠️ Bu bir flash bellek gibi görünmüyor, ama devam ediliyor...")
        setDriveHandle(directoryHandle)
        setStep("checking-wallet")
        await checkWalletInDrive(directoryHandle)
      }
    } catch (err: any) {
      console.error("❌ Flash bellek doğrulama hatası:", err)
      // Hata olsa bile devam et
      setDriveHandle(directoryHandle)
      setStep("checking-wallet")
      await checkWalletInDrive(directoryHandle)
    }
  }

  const checkWalletInDrive = async (directoryHandle: any) => {
    try {
      console.log("🔍 Flash bellekte wallet.txt aranıyor...")

      try {
        // wallet.txt dosyasını bul
        const walletFileHandle = await directoryHandle.getFileHandle("wallet.txt")
        const walletFile = await walletFileHandle.getFile()
        const content = await walletFile.text()

        console.log(`✅ wallet.txt bulundu!`)
        console.log(`📄 Dosya boyutu: ${walletFile.size} bytes`)
        console.log(`📅 Son değişiklik: ${walletFile.lastModified}`)
        console.log(`📝 İçerik: ${content.substring(0, 50)}...`)

        // Wallet içeriğini parse et
        let walletContent = content.trim()

        // Eğer PUBLIC= formatındaysa sadece değeri al
        if (walletContent.includes("PUBLIC=")) {
          const lines = walletContent.split("\n")
          const publicLine = lines.find((line) => line.startsWith("PUBLIC="))
          walletContent = publicLine?.split("=")[1] || walletContent
        }

        setWalletCode(walletContent)
        setStep("validating")
        const apiResponse = await validateUser(walletContent)
        await handleApiResponse(apiResponse, walletContent)
      } catch (fileError) {
        console.log("❌ wallet.txt bulunamadı, oluşturuluyor...")
        console.log("📝 Hata detayı:", fileError)
        setStep("creating-wallet")
        await createWalletInDrive(directoryHandle)
      }
    } catch (err: any) {
      console.error("❌ Wallet kontrol hatası:", err)
      throw new Error("Wallet dosyası kontrolü başarısız: " + err.message)
    }
  }

  const createWalletInDrive = async (directoryHandle: any) => {
    try {
      console.log("💾 Flash bellekte wallet.txt oluşturuluyor...")

      const newWalletCode = generateWalletCode()
      console.log(`🔑 Yeni wallet kodu: ${newWalletCode}`)

      // wallet.txt dosyasını oluştur
      const walletFileHandle = await directoryHandle.getFileHandle("wallet.txt", { create: true })
      const writable = await walletFileHandle.createWritable()

      // Wallet formatı
      const walletContent = `PUBLIC=${newWalletCode}
CREATED=${new Date().toISOString()}
VERSION=1.0
DEVICE=${driveName}
PLATFORM=Stellar Academy`

      await writable.write(walletContent)
      await writable.close()

      console.log("✅ wallet.txt başarıyla oluşturuldu!")
      console.log(`📂 Dosya konumu: ${driveName}/wallet.txt`)
      console.log(`🔑 Dosya içeriği:\n${walletContent}`)

      setWalletCode(newWalletCode)
      setStep("validating")
      const apiResponse = await validateUser(newWalletCode)
      await handleApiResponse(apiResponse, newWalletCode)
    } catch (err: any) {
      console.error("❌ Wallet oluşturma hatası:", err)
      throw new Error("Wallet dosyası oluşturulamadı: " + err.message)
    }
  }

  const generateWalletCode = (): string => {
    // Güvenli wallet kodu üret
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const validateUser = async (walletCode: string): Promise<ApiResponse> => {
    try {
      console.log(`🌐 Kullanıcı doğrulanıyor: ${walletCode.substring(0, 8)}...`)
      console.log(`📡 İstek gönderiliyor: http://goktugtunc.com:3434/check_user?public_key=${walletCode}`)

      const response = await fetch(`http://goktugtunc.com:3434/check_user?public_key=${walletCode}`)

      if (!response.ok) {
        console.error(`❌ HTTP Hata: ${response.status} ${response.statusText}`)
        throw new Error(`HTTP ${response.status}: ${getHttpErrorMessage(response.status)}`)
      }

      const data: ApiResponse = await response.json()
      console.log(`📨 Sunucu yanıtı:`, data)
      return data
    } catch (err) {
      console.error("❌ Doğrulama hatası:", err)
      return {
        name: null,
        surname: null,
        token: null,
        status: "başarısız",
      }
    }
  }

  const getHttpErrorMessage = (status: number): string => {
    switch (status) {
      case 400:
        return "Geçersiz istek. Lütfen wallet kodunuzu kontrol edin."
      case 401:
        return "Yetkilendirme hatası. Lütfen tekrar giriş yapmayı deneyin."
      case 403:
        return "Bu işlem için yetkiniz bulunmuyor."
      case 404:
        return "Kullanıcı bulunamadı. Lütfen kayıt olmayı deneyin."
      case 429:
        return "Çok fazla istek gönderildi. Lütfen biraz bekleyin."
      case 500:
        return "Sunucu hatası. Lütfen daha sonra tekrar deneyin."
      case 502:
        return "Sunucu geçici olarak kullanılamıyor."
      case 503:
        return "Servis geçici olarak kullanılamıyor."
      default:
        return "Bilinmeyen bir hata oluştu."
    }
  }

  const handleApiResponse = async (apiResponse: ApiResponse, walletCode: string) => {
    switch (apiResponse.status) {
      case "başarılı":
        console.log("🎉 Giriş başarılı!")
        console.log(`👤 Kullanıcı: ${apiResponse.name} ${apiResponse.surname}`)
        console.log(`🔑 Token: ${apiResponse.token}`)

        localStorage.setItem("stellar_user_token", apiResponse.token!)
        localStorage.setItem("stellar_user_name", `${apiResponse.name} ${apiResponse.surname}`)

        setStep("success")
        setTimeout(() => {
          onLogin(walletCode, apiResponse.token!, `${apiResponse.name} ${apiResponse.surname}`)
        }, 1500)
        break

      case "Geçersiz Cüzdan Kodu":
        console.log("❌ Geçersiz cüzdan kodu")
        setError("Geçersiz cüzdan kodu. Lütfen wallet dosyanızı kontrol edin.")
        setStep("initial")
        break

      case "başarısız":
        console.log("📝 Kullanıcı kaydı gerekli")
        setStep("registration")
        break

      default:
        console.log("❓ Bilinmeyen yanıt:", apiResponse.status)
        setError("Beklenmeyen bir yanıt alındı. Lütfen tekrar deneyin.")
        setStep("initial")
        break
    }
  }

  const handleUserRegistration = async (name: string, surname: string) => {
    try {
      console.log(`📝 Kullanıcı kaydı yapılıyor: ${name} ${surname}`)

      const response = await fetch("http://goktugtunc.com:3434/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          surname: surname,
          public_key: walletCode,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${getHttpErrorMessage(response.status)}`)
      }

      const data: CreateUserResponse = await response.json()

      if (data.message === "Kullanıcı başarıyla oluşturuldu" && data.user && data.user.token) {
        localStorage.setItem("stellar_user_token", data.user.token)
        localStorage.setItem("stellar_user_name", `${data.user.name} ${data.user.surname}`)
        localStorage.setItem("stellar_public_key", data.user.public_key)

        setStep("success")
        setTimeout(() => {
          onLogin(data.user.public_key, data.user.token, `${data.user.name} ${data.user.surname}`)
        }, 1500)
      } else {
        throw new Error("Kullanıcı kaydı başarısız.")
      }
    } catch (err: any) {
      console.error("❌ Kayıt hatası:", err)
      throw err
    }
  }

  const isFileSystemSupported = () => {
    return "showDirectoryPicker" in window
  }

  if (step === "registration") {
    return (
      <UserRegistrationForm onClose={onClose} onRegister={handleUserRegistration} onBack={() => setStep("initial")} />
    )
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
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-white">Flash Bellek Girişi</CardTitle>
          </div>
          <CardDescription className="text-gray-300">Flash bellek dizinini seçin</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {!isFileSystemSupported() && (
            <Alert className="bg-yellow-500/10 border-yellow-500/20">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                Tarayıcınız dosya sistemi erişimini desteklemiyor. Chrome veya Edge kullanın.
              </AlertDescription>
            </Alert>
          )}

          {step === "initial" && (
            <div className="text-center py-4">
              <HardDrive className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <div className="text-white mb-2">Flash Bellek Seçin</div>
              <div className="text-sm text-gray-400">Flash belleğinizin kök dizinini seçin (örn: F:\)</div>
            </div>
          )}

          {step === "requesting-access" && (
            <div className="text-center py-4">
              <FolderOpen className="h-12 w-12 text-purple-400 mx-auto mb-2 animate-pulse" />
              <div className="text-white mb-2">Erişim isteniyor...</div>
              <div className="text-sm text-gray-400">Tarayıcı izin penceresini bekleyin</div>
            </div>
          )}

          {step === "checking-drive" && (
            <div className="text-center py-4">
              <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-2 animate-spin" />
              <div className="text-white mb-2">Flash bellek kontrol ediliyor...</div>
              <div className="text-sm text-gray-400">
                {driveName && <span className="text-purple-300">{driveName}</span>}
              </div>
            </div>
          )}

          {step === "checking-wallet" && (
            <div className="text-center py-4">
              <FileText className="h-12 w-12 text-blue-400 mx-auto mb-2 animate-pulse" />
              <div className="text-white mb-2">Wallet aranıyor...</div>
              <div className="text-sm text-gray-400">{driveName}/wallet.txt kontrol ediliyor</div>
            </div>
          )}

          {step === "creating-wallet" && (
            <div className="text-center py-4">
              <div className="h-12 w-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">💾</span>
              </div>
              <div className="text-white mb-2">Wallet oluşturuluyor...</div>
              <div className="text-sm text-gray-400">{driveName}/wallet.txt yazılıyor</div>
            </div>
          )}

          {step === "validating" && (
            <div className="text-center py-4">
              <div className="h-12 w-12 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔐</span>
              </div>
              <div className="text-white mb-2">Kullanıcı doğrulanıyor...</div>
              <div className="text-sm text-gray-400">Sunucu ile iletişim kuruluyor</div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
              <div className="text-white mb-2">Giriş başarılı!</div>
              <div className="text-sm text-gray-400">Eğitim paneline yönlendiriliyorsunuz...</div>
            </div>
          )}

          {step === "initial" && (
            <Button
              onClick={handleLogin}
              disabled={isLoading || !isFileSystemSupported()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Erişim isteniyor...
                </>
              ) : (
                <>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Flash Bellek Seç
                </>
              )}
            </Button>
          )}

          <div className="text-xs text-gray-400 text-center">
            {step === "initial"
              ? "Flash belleğinizi takın ve kök dizinini seçin"
              : step === "requesting-access"
                ? "Açılan pencerede flash belleğinizi seçin"
                : "İşlem devam ediyor..."}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
