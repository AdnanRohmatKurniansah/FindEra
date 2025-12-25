import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email } = await req.json()

  const { data } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const user = data.users.find(u => u.email === email)

  if (!user) {
    return NextResponse.json({ exists: false })
  }

  const providers = user.identities?.map(i => i.provider) || []

  return NextResponse.json({
    exists: true,
    providers,
    providerCount: providers.length,
  })
}
