'use client'

import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

interface SaveButtonProps {
  articleId: string
  className?: string
}

export function SaveButtonSimple({ articleId, className }: SaveButtonProps) {
  const { user, isAuthenticated } = useAuth()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check if article is saved when component mounts
  useEffect(() => {
    if (user && isAuthenticated && !isInitialized) {
      checkSavedStatus()
    } else if (!user || !isAuthenticated) {
      setIsSaved(false)
      setIsInitialized(true)
    }
  }, [user, isAuthenticated, articleId, isInitialized])

  const checkSavedStatus = async () => {
    if (!user || !isAuthenticated) return

    try {
      console.log('Checking saved status for:', articleId)
      const response = await fetch(`/api/saved-articles/check/${articleId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Check result:', data)
        setIsSaved(data.saved || false)
      } else {
        console.log('Check failed with status:', response.status)
        setIsSaved(false)
      }
    } catch (error) {
      console.error('Error checking saved status:', error)
      setIsSaved(false)
    } finally {
      setIsInitialized(true)
    }
  }

  const handleToggleSave = async () => {
    if (!user || !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save articles",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      console.log('Toggling save for:', articleId)
      const response = await fetch(`/api/saved-articles/toggle/${articleId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Toggle result:', data)
        setIsSaved(data.saved)

        toast({
          title: data.saved ? "Article saved" : "Article unsaved",
          description: data.saved
            ? "Article has been added to your saved list"
            : "Article has been removed from your saved list"
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to toggle save')
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render for non-authenticated users
  if (!user) {
    return null
  }

  // Show loading state while checking initial status
  if (!isInitialized) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className={className}
      >
        <div className="h-4 w-4 animate-pulse bg-gray-300 rounded" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleSave}
      disabled={isLoading}
      className={className}
      aria-label={isSaved ? "Unsave article" : "Save article"}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : isSaved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  )
}
