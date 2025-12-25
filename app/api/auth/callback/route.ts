import { createServerSupabase } from "@/lib/supabase/server"
import { profileData } from "@/types"
import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
  try {
    const { searchParams, origin } = new URL(request.url)

    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/akun"

    if (!code) {
      return NextResponse.redirect(`${origin}/sign-in?error=invalid_code`)
    }

    const supabase = await createServerSupabase()

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(`${origin}/sign-in?error=${exchangeError.message}`)
    }

    const { data: userData } = await supabase.auth.getUser()

    const user = userData?.user

    if (user) {
      const { data: existingProfile, error: selectError } = await supabase
        .from("profiles")
        .select("id, name, phone, image")
        .eq("id_user", user.id)
        .maybeSingle()

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          id_user: user.id,
          name: user.user_metadata?.name ?? "User",
          phone: null,
          image: user.user_metadata?.avatar_url ?? null,
        })
      } else {
        const updates: Partial<profileData> = {}

        if (!existingProfile.name) {
          updates.name = user.user_metadata?.name ?? "User"
        }

        if (!existingProfile.image) {
          updates.image = user.user_metadata?.avatar_url ?? null
        }

        if (Object.keys(updates).length > 0) {
          await supabase.from("profiles").update(updates).eq("id_user", user.id)
        }
      }
    } else {
      console.log("No user after login")
    }

    return NextResponse.redirect(`${origin}${next}`)
  } catch (err) {
    return NextResponse.redirect(`/sign-in?error=callback_failed`)
  }
}
