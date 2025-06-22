"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, RotateCcw, GripVertical } from "lucide-react"

interface DragDropGameProps {
  onComplete: (score: number) => void
}

interface DragItem {
  id: string
  text: string
  category: string
}

interface DropZone {
  id: string
  title: string
  description: string
  acceptedItems: string[]
}

export default function DragDropGame({ onComplete }: DragDropGameProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [droppedItems, setDroppedItems] = useState<{ [zoneId: string]: string[] }>({
    accounts: [],
    assets: [],
    operations: [],
    network: [],
  })
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const items: DragItem[] = [
    { id: "public-key", text: "Public Key", category: "accounts" },
    { id: "secret-key", text: "Secret Key", category: "accounts" },
    { id: "sequence-number", text: "Sequence Number", category: "accounts" },
    { id: "xlm", text: "XLM (Lumens)", category: "assets" },
    { id: "trustline", text: "Trustline", category: "assets" },
    { id: "custom-token", text: "Custom Token", category: "assets" },
    { id: "payment", text: "Payment", category: "operations" },
    { id: "create-account", text: "Create Account", category: "operations" },
    { id: "manage-offer", text: "Manage Offer", category: "operations" },
    { id: "consensus", text: "Stellar Consensus Protocol", category: "network" },
    { id: "validators", text: "Validators", category: "network" },
    { id: "ledger", text: "Ledger", category: "network" },
  ]

  const dropZones: DropZone[] = [
    {
      id: "accounts",
      title: "Hesap Bileşenleri",
      description: "Stellar hesaplarıyla ilgili kavramlar",
      acceptedItems: ["public-key", "secret-key", "sequence-number"],
    },
    {
      id: "assets",
      title: "Varlık Türleri",
      description: "Stellar ağındaki farklı varlık türleri",
      acceptedItems: ["xlm", "trustline", "custom-token"],
    },
    {
      id: "operations",
      title: "İşlem Türleri",
      description: "Stellar'da yapılabilecek operasyonlar",
      acceptedItems: ["payment", "create-account", "manage-offer"],
    },
    {
      id: "network",
      title: "Ağ Bileşenleri",
      description: "Stellar ağının çalışma mekanizması",
      acceptedItems: ["consensus", "validators", "ledger"],
    },
  ]

  const availableItems = items.filter((item) => !Object.values(droppedItems).flat().includes(item.id))

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault()
    if (!draggedItem) return

    const newDroppedItems = { ...droppedItems }
    if (!newDroppedItems[zoneId].includes(draggedItem)) {
      newDroppedItems[zoneId] = [...newDroppedItems[zoneId], draggedItem]
      setDroppedItems(newDroppedItems)
    }
    setDraggedItem(null)
  }

  const removeItem = (zoneId: string, itemId: string) => {
    const newDroppedItems = { ...droppedItems }
    newDroppedItems[zoneId] = newDroppedItems[zoneId].filter((id) => id !== itemId)
    setDroppedItems(newDroppedItems)
  }

  const checkAnswers = () => {
    let correctCount = 0
    let totalItems = 0

    dropZones.forEach((zone) => {
      const zoneItems = droppedItems[zone.id]
      zoneItems.forEach((itemId) => {
        totalItems++
        if (zone.acceptedItems.includes(itemId)) {
          correctCount++
        }
      })
    })

    setScore(Math.round((correctCount / items.length) * 100))
    setShowResults(true)
  }

  const resetGame = () => {
    setDroppedItems({
      accounts: [],
      assets: [],
      operations: [],
      network: [],
    })
    setShowResults(false)
    setScore(0)
  }

  const isCorrectPlacement = (zoneId: string, itemId: string) => {
    const zone = dropZones.find((z) => z.id === zoneId)
    return zone?.acceptedItems.includes(itemId) || false
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Sürükle ve Bırak Oyunu</CardTitle>
          <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
            Stellar Bileşenleri
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Talimatlar */}
        <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-lg">
          <p className="text-blue-300 text-sm">
            Aşağıdaki kavramları doğru kategorilere sürükleyip bırakın. Her kavram sadece bir kategoriye ait olmalıdır.
          </p>
        </div>

        {/* Sürüklenebilir öğeler */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Kavramlar:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable={!showResults}
                onDragStart={(e) => handleDragStart(e, item.id)}
                className={`
                  bg-white/10 border border-white/20 p-3 rounded-lg cursor-move
                  hover:bg-white/20 transition-colors flex items-center gap-2
                  ${showResults ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
                <span className="text-white text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bırakma alanları */}
        <div className="grid md:grid-cols-2 gap-4">
          {dropZones.map((zone) => (
            <div
              key={zone.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zone.id)}
              className="bg-white/5 border-2 border-dashed border-white/20 p-4 rounded-lg min-h-[150px]"
            >
              <h4 className="text-white font-medium mb-2">{zone.title}</h4>
              <p className="text-gray-400 text-sm mb-3">{zone.description}</p>

              <div className="space-y-2">
                {droppedItems[zone.id].map((itemId) => {
                  const item = items.find((i) => i.id === itemId)
                  const isCorrect = showResults && isCorrectPlacement(zone.id, itemId)
                  const isIncorrect = showResults && !isCorrectPlacement(zone.id, itemId)

                  return (
                    <div
                      key={itemId}
                      className={`
                        bg-white/10 border p-2 rounded flex items-center justify-between
                        ${isCorrect ? "border-green-400 bg-green-400/20" : ""}
                        ${isIncorrect ? "border-red-400 bg-red-400/20" : "border-white/20"}
                      `}
                    >
                      <span className="text-white text-sm">{item?.text}</span>
                      <div className="flex items-center gap-2">
                        {showResults && isCorrect && <CheckCircle className="h-4 w-4 text-green-400" />}
                        {showResults && isIncorrect && <X className="h-4 w-4 text-red-400" />}
                        {!showResults && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(zone.id, itemId)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sonuçlar */}
        {showResults && (
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">Sonuçlar:</h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">%{score}</div>
              <div className="text-gray-300">Doğruluk oranı</div>
            </div>
          </div>
        )}

        {/* Kontroller */}
        <div className="flex justify-between items-center">
          <div className="text-white">
            <span className="text-sm text-gray-300">Yerleştirilen: </span>
            <span className="font-bold">
              {Object.values(droppedItems).flat().length} / {items.length}
            </span>
          </div>

          <div className="flex gap-2">
            {!showResults ? (
              <>
                <Button
                  variant="outline"
                  onClick={resetGame}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sıfırla
                </Button>
                <Button
                  onClick={checkAnswers}
                  disabled={Object.values(droppedItems).flat().length === 0}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Kontrol Et
                </Button>
              </>
            ) : (
              <Button
                onClick={() => onComplete(score)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Tamamla
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
