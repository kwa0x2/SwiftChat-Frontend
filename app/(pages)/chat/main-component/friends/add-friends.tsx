"use client";
import FormError from "@/components/form-error";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Search } from "@/components/ui/search";
import { Disclosure } from "@headlessui/react";
import { toast } from "sonner";
import { AddFriendSchemas } from "@/schemas/addfriend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import io, { Socket } from "socket.io-client";

interface AddFriendProps {
  socket: Socket | null;
  user: any;
}

const AddFriend: React.FC<AddFriendProps> = ({ socket, user }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof AddFriendSchemas>>({
    resolver: zodResolver(AddFriendSchemas),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AddFriendSchemas>) => {
    let email = values.email;
    if (email !== user.email) {
      if (socket) {
        console.warn(`sent`)
        socket.emit("sendFriend", email, (response: any) => {
          if (response.status === "error") {
            toast.error("An unknown error occurred. Please try again later");
          } else if (response.status === "duplicate") {
            toast.warning("You have already sent a friend request to " + email + "!");
          } else if (response.status === "friend_sent") {
            toast.success("Friend request sent successfully to " + email + "!");
          } else if (response.status === "email_sent") {
            toast.success(
              "No such user exists, so the friend request has been sent to " +
                email +
                " via email!"
            );
          }
        });
      }
    } else {
      toast.warning("You cannot send a friend request to yourself.");
    }
  };

  return (
    <Disclosure as="nav" className="border-b border-[#5C6B81]">
      <div className="relative  px-5 flex h-20 items-center justify-between gap-5">
        <Form {...form}>
          <form
            className="w-full flex gap-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Search
                      {...field}
                      id="email"
                      placeholder="Please enter the email of the person you want to add as a friend."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError className="mb-3" message={errorMessage} />

            <Button
              type="submit"
              className="bg-[#4A32B0] border-none  hover:bg-[#4A32B0] hover:text-white text-white"
              variant={"outline"}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </Disclosure>
  );
};

export default AddFriend;
