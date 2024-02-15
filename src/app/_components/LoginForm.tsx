"use client";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signInWithEmailAndPassword } from "../(auth)/actions";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password is required.",
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "dev1@gmail.com",
      password: "dev1234$",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("form submitted");
    const result = await signInWithEmailAndPassword(data);
    console.log("result", result);
    const { error } = result;

    if (error?.message) {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{error.message}</code>
          </pre>
        ),
      });
    } else {
      toast({
        title: "Sucessfully Logged In:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            Sucessfully Registered:
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      router.push("/");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-80 space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="text-black"
                    placeholder="example@gmail.com"
                    {...field}
                    type="email"
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="text-black"
                    placeholder="password"
                    {...field}
                    type="password"
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="flex w-full gap-2">
            Login
            <AiOutlineLoading3Quarters className={cn("animate-spin")} />
          </Button>
        </form>
      </Form>
      <span>or</span>
      <Button
        className="text-black"
        variant={"outline"}
        onClick={() => router.push("/register")}
      >
        Register
      </Button>
    </div>
  );
}
