import './index.css'
import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient} from '@supabase/supabase-js'


const supabaseUrl = 'https://ajuqdoycpyvofiqvmtwn.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdXFkb3ljcHl2b2ZpcXZtdHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI1MjU0NTMsImV4cCI6MTk5ODEwMTQ1M30.Lw6T6Hr_Ui0DQa8mkzrObfyXkY-VT5Bs0LcQH1Mljgc"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function AuthApp() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    return (<div>Logged in!</div>)
  }
}