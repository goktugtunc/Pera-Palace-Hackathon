"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Copy, CheckCircle } from "lucide-react"

interface WalletFallbackProps {
  walletCode: string
  onContinue: () => void
}

export default function WalletFallback({ walletCode, onContinue }: WalletFallbackProps) {
  const [copied, setCopied] = useState(false)

  const downloadWalletFile = () => {
    console.log("💾 Wallet dosyası indiriliyor...")
    console.log(`🔑 Wallet kodu: ${walletCode}`)

    const blob = new Blob([walletCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "wallet.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log("✅ Wallet.txt dosyası indirme başlatıldı!")
    console.log("📍 Dosya konumu: Tarayıcının varsayılan indirme klasörü/wallet.txt")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletCode)
      setCopied(true)
      console.log("📋 Wallet kodu panoya kopyalandı!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("❌ Panoya kopyalama hatası:", err)
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white">Wallet Oluşturuldu!</CardTitle>
        <CardDescription className="text-gray-300">Wallet kodunuzu güvenli bir yere kaydedin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">Yeni wallet başarıyla oluşturuldu!</AlertDescription>
        </Alert>

        <div className="bg-black/20 p-4 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Wallet Kodu:</div>
          <div className="text-white font-mono text-sm break-all">{walletCode}</div>
        </div>

        <div className="flex gap-2">
          <Button onClick={downloadWalletFile} className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4 mr-2" />
            İndir
          </Button>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Kopyalandı!" : "Kopyala"}
          </Button>
        </div>

        <Button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Devam Et
        </Button>

        <div className="text-xs text-gray-400 text-center">
          Bu kodu güvenli bir yerde saklayın. Tekrar giriş yapmak için gerekli olacak.
        </div>
      </CardContent>
    </Card>
  )
}
