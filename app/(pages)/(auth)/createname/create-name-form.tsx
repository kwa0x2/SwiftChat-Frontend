"use client";
import FormError from "@/components/form-error";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {AnimationInput} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {UsernameSchemas} from "@/schemas/username";
import {zodResolver} from "@hookform/resolvers/zod";

import {loginAction} from "@/actions/login";
import {LabelInputContainer} from "@/components/label-input-container";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import { signup } from "@/app/api/services/auth.Service";

interface CreateNameFormProps {
    token: string;
    user_photo: string;
}

const CreateNameForm = ({token, user_photo}: CreateNameFormProps) => {
    const [isPending, setIsPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    //#region FORM SCHEMA SETTINGS
    const form = useForm<z.infer<typeof UsernameSchemas>>({
        resolver: zodResolver(UsernameSchemas),
        defaultValues: {
            username: "",
        },
    });
    //#endregion

    const onSubmit = async (values: z.infer<typeof UsernameSchemas>) => {
        setIsPending(true); 
    
        try {
            const res = await signup(token, values.username, user_photo);
            
            if (res.status === 201) {
                await loginAction(
                    res.data.user_id,
                    res.data.user_name,
                    res.data.user_email,
                    res.data.user_photo
                );
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        } catch (error: any) {
            if (error.response.data.code === 409) {
                setErrorMessage("This username is already taken.");
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        } finally {
            setIsPending(false); 
        }
    };

    return (
        <>
            <Form {...form}>
                <form {...form} className="" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <LabelInputContainer className="mb-4">
                                    <FormLabel>
                                        <Label htmlFor="username">Username</Label>
                                    </FormLabel>
                                    <FormMessage/>
                                    <FormControl>
                                        <AnimationInput
                                            {...field}
                                            id="username"
                                            placeholder="Please enter a username..."
                                            type="text"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                </LabelInputContainer>
                            </FormItem>
                        )}
                    />
                    <FormError className="mb-3" message={errorMessage}/>

                    <button
                        disabled={isPending}
                        className="bg-gradient-to-br relative group/btn bg-black w-full text-white rounded-md h-10 font-medium "
                        type="submit"
                    >
                        {isPending ? "Please Wait..." : "Sign Up"}
                    </button>
                </form>
            </Form>
        </>
    );
};

export default CreateNameForm;
