// Supabase configuration
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2'

// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://veknjqnfignxuexlekvt.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZla25qcW5maWdueHVleGxla3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTEwOTYsImV4cCI6MjA3MDIyNzA5Nn0.RsddK9MnDp0YYM-OZHsjk2tDgaNUb6CxeZ50x2glK6I'

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Database functions for portfolio features
export class PortfolioDatabase {

   // Contact form submissions
   async saveContactSubmission(formData) {
      try {
         const { data, error } = await supabase
            .from('contact_submissions')
            .insert([
               {
                  name: formData.name,
                  email: formData.email,
                  message: formData.message,
                  submitted_at: new Date().toISOString(),
                  ip_address: await this.getClientIP(),
                  user_agent: navigator.userAgent
               }
            ])

         if (error) throw error
         return { success: true, data }
      } catch (error) {
         console.error('Error saving contact submission:', error)
         return { success: false, error: error.message }
      }
   }

   // Portfolio views tracking
   async trackPageView(page) {
      try {
         const { data, error } = await supabase
            .from('page_views')
            .insert([
               {
                  page: page,
                  viewed_at: new Date().toISOString(),
                  ip_address: await this.getClientIP(),
                  user_agent: navigator.userAgent,
                  referrer: document.referrer || 'direct'
               }
            ])

         if (error) throw error
         return { success: true, data }
      } catch (error) {
         console.error('Error tracking page view:', error)
         return { success: false, error: error.message }
      }
   }

   // Get portfolio analytics
   async getAnalytics() {
      try {
         // Get total views
         const { data: totalViews, error: viewsError } = await supabase
            .from('page_views')
            .select('id')

         // Get contact submissions count
         const { data: contactCount, error: contactError } = await supabase
            .from('contact_submissions')
            .select('id')

         // Get recent visitors (last 30 days)
         const thirtyDaysAgo = new Date()
         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

         const { data: recentViews, error: recentError } = await supabase
            .from('page_views')
            .select('ip_address')
            .gte('viewed_at', thirtyDaysAgo.toISOString())

         if (viewsError || contactError || recentError) {
            throw viewsError || contactError || recentError
         }

         // Count unique visitors
         const uniqueVisitors = new Set(recentViews.map(view => view.ip_address)).size

         return {
            success: true,
            data: {
               totalViews: totalViews.length,
               contactSubmissions: contactCount.length,
               uniqueVisitors: uniqueVisitors
            }
         }
      } catch (error) {
         console.error('Error getting analytics:', error)
         return { success: false, error: error.message }
      }
   }

   // Project interactions tracking
   async trackProjectClick(projectName, linkType) {
      try {
         const { data, error } = await supabase
            .from('project_interactions')
            .insert([
               {
                  project_name: projectName,
                  interaction_type: linkType,
                  clicked_at: new Date().toISOString(),
                  ip_address: await this.getClientIP(),
                  user_agent: navigator.userAgent
               }
            ])

         if (error) throw error
         return { success: true, data }
      } catch (error) {
         console.error('Error tracking project click:', error)
         return { success: false, error: error.message }
      }
   }

   // Newsletter subscription (if you want to add this feature)
   async subscribeToNewsletter(email) {
      try {
         const { data, error } = await supabase
            .from('newsletter_subscribers')
            .insert([
               {
                  email: email,
                  subscribed_at: new Date().toISOString(),
                  is_active: true
               }
            ])

         if (error) throw error
         return { success: true, data }
      } catch (error) {
         console.error('Error subscribing to newsletter:', error)
         return { success: false, error: error.message }
      }
   }

   // Skills feedback (users can rate your skills)
   async submitSkillFeedback(skillName, rating, feedback) {
      try {
         const { data, error } = await supabase
            .from('skill_feedback')
            .insert([
               {
                  skill_name: skillName,
                  rating: rating,
                  feedback: feedback,
                  submitted_at: new Date().toISOString(),
                  ip_address: await this.getClientIP()
               }
            ])

         if (error) throw error
         return { success: true, data }
      } catch (error) {
         console.error('Error submitting skill feedback:', error)
         return { success: false, error: error.message }
      }
   }

   // Get average skill ratings
   async getSkillRatings() {
      try {
         const { data, error } = await supabase
            .rpc('get_skill_averages')

         if (error) throw error
         return { success: true, data }
      } catch (error) {
         console.error('Error getting skill ratings:', error)
         return { success: false, error: error.message }
      }
   }

   // Helper function to get client IP
   async getClientIP() {
      try {
         const response = await fetch('https://api.ipify.org?format=json')
         const data = await response.json()
         return data.ip
      } catch (error) {
         console.error('Error getting IP:', error)
         return 'unknown'
      }
   }
}

// Initialize database instance
export const portfolioDb = new PortfolioDatabase()

// Real-time subscriptions for live features
export class RealtimeFeatures {

   // Subscribe to live visitor count
   subscribeToVisitorCount(callback) {
      const subscription = supabase
         .channel('visitor-count')
         .on('postgres_changes',
            {
               event: 'INSERT',
               schema: 'public',
               table: 'page_views'
            },
            callback
         )
         .subscribe()

      return subscription
   }

   // Subscribe to new contact submissions (for admin dashboard)
   subscribeToContactSubmissions(callback) {
      const subscription = supabase
         .channel('contact-submissions')
         .on('postgres_changes',
            {
               event: 'INSERT',
               schema: 'public',
               table: 'contact_submissions'
            },
            callback
         )
         .subscribe()

      return subscription
   }

   // Live chat functionality (if you want to add this)
   subscribeToMessages(callback) {
      const subscription = supabase
         .channel('live-chat')
         .on('postgres_changes',
            {
               event: 'INSERT',
               schema: 'public',
               table: 'chat_messages'
            },
            callback
         )
         .subscribe()

      return subscription
   }
}

// Initialize realtime features
export const realtimeFeatures = new RealtimeFeatures()

// Authentication functions (if you want admin features)
export class PortfolioAuth {

   // Admin login
   async adminSignIn(email, password) {
      try {
         const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
         })

         if (error) throw error
         return { success: true, user: data.user }
      } catch (error) {
         console.error('Error signing in:', error)
         return { success: false, error: error.message }
      }
   }

   // Check if user is admin
   async isAdmin() {
      try {
         const { data: { user } } = await supabase.auth.getUser()

         if (!user) return false

         const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('user_id', user.id)
            .single()

         if (error) return false
         return !!data
      } catch (error) {
         console.error('Error checking admin status:', error)
         return false
      }
   }

   // Sign out
   async signOut() {
      const { error } = await supabase.auth.signOut()
      return { success: !error, error: error?.message }
   }
}

// Initialize auth
export const portfolioAuth = new PortfolioAuth()
