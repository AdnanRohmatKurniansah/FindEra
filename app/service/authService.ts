import { createClientSupabase } from "@/app/utils/supabase/client";

export type registerData = {
    name: string
    email: string
    password: string
}

export type loginData = {
    email: string
    password: string
}

export const registerEmail = async (credentails: registerData) => {
    const { data, error } = await createClientSupabase().auth.signUp({
        email: credentails.email,
        password: credentails.password,
        options: {
            data: {
                name: credentails.name, 
            }
        }
    })

    if (error) {
        return { data, error };
    } 

    const userId = data.user?.id;

    if (userId) {
        await createClientSupabase().from("profiles").insert({
            id: userId,
            name: credentails.name
        });
    }

    return { data, error: null };
}

export const loginWithEmail = async (credentials: loginData) => {
    const { data, error } = await createClientSupabase().auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    return { data, error };
};