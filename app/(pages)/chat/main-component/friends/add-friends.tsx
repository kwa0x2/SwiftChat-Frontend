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
import { Socket } from "socket.io-client";
import { SendFriendRequest } from "@/app/api/services/request.Service";
import axios from "axios";

interface AddFriendProps {
  user: any;
}

const AddFriend: React.FC<AddFriendProps> = ({ user }) => {
  const form = useForm<z.infer<typeof AddFriendSchemas>>({
    resolver: zodResolver(AddFriendSchemas),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof AddFriendSchemas>) {
    if (user.mail === formData.email) {
      toast.error("You cannot send a friend request to yourself.");
    } else {
      try {
        const res = await SendFriendRequest(formData.email);
        if (res.status === 200) {
          if (res.data.status === "Friend Sent") {
            toast.success(
              `Friend request sent successfully to ${formData.email}!`
            );
          } else if (res.data.status === "Email Sent") {
            toast.success(
              `No such user exists, so the friend request has been sent to ${formData.email} via email!`
            );
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const { status, data } = error.response;

          if (status === 409) {
            switch (data.error) {
              case "Already Friend":
                toast.warning(
                  `${formData.email} is already in your friends list!`
                );
                break;
              case "Already Sent":
                toast.warning(
                  `You have already sent a friend request to ${formData.email}!`
                );
                break;
              case "Blocked User":
                toast.warning(
                  `Either you have blocked ${formData.email} or they have blocked you!`
                );
                break;
              default:
                toast.error(
                  "An unknown error occurred. Please try again later."
                );
            }
          } else {
            toast.error("An unknown error occurred. Please try again later.");
          }
        }
      }
    }
  }

  return (
    <Disclosure as="nav" className="border-b border-[#5C6B81]">
      <div className="relative px-5 flex h-20 items-center justify-between gap-5">
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

            <Button
              type="submit"
              className="bg-[#4A32B0] border-none hover:bg-[#4A32B0] hover:text-white text-white"
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
