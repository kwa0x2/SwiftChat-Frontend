"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Search } from "@/components/ui/search";
import { Disclosure } from "@headlessui/react";
import { AddFriendSchemas } from "@/schemas/addfriend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SendFriendRequest } from "@/app/api/services/request.Service";
import axios from "axios";
import { IoIosSend } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { toast } from "sonner";

interface AddFriendProps {
  user: any;
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenChatList: boolean;
}

const AddFriend: React.FC<AddFriendProps> = ({
  user,
  setIsOpenChatList,
  isOpenChatList,
}) => {
  const form = useForm<z.infer<typeof AddFriendSchemas>>({
    resolver: zodResolver(AddFriendSchemas),
    defaultValues: {
      email: "",
    },
  });

  //#region Form Submission Handler
  async function onSubmit(formData: z.infer<typeof AddFriendSchemas>) {
    if (user.email === formData.email) {
      toast.error("You cannot send a friend request to yourself.");
      return;
    }

    try {
      const res = await SendFriendRequest(formData.email);
      if (res.status === 200) {
        handleResponse(res.data.status, formData.email);
      }
    } catch (error) {
      handleError(error,formData);
    }
  }

  // Handle responses from the API
  const handleResponse = (status: string, email: string) => {
    switch (status) {
      case "Friend Sent":
        toast.success(`Friend request sent successfully to ${email}!`);
        break;
      case "Email Sent":
        toast.success(
          `No such user exists, so the friend request has been sent to ${email} via email!`
        );
        break;
      default:
        toast.error("An unknown error occurred. Please try again later.");
    }
  };

  // Handle API errors
  const handleError = (error: any, formData:  z.infer<typeof AddFriendSchemas>) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;

      if (status === 409) {
        handleConflictError(data.error,formData);
      } else {
        toast.error("An unknown error occurred. Please try again later.");
      }
    }
  };

  // Handle specific conflict errors
  const handleConflictError = (errorType: string, formData:  z.infer<typeof AddFriendSchemas>) => {
    switch (errorType) {
      case "Already Friend":
        toast.warning(`${formData.email} is already in your friends list!`);
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
        toast.error("An unknown error occurred. Please try again later.");
    }
  };
  //#endregion

  //#region Toggle Chat List Visibility
  const handleMenuClick = () => {
    setIsOpenChatList(!isOpenChatList);
  };
  //#endregion
  
  return (
    <Disclosure as="nav" className="border-b border-[#5C6B81]">
      <div className="px-5 flex h-20 gap-2 items-center justify-between">
        <Button
          className="bg-[#4A32B0] block sm:hidden border-none hover:bg-[#4A32B0] hover:text-white text-white"
          variant={"outline"}
          size={"icon"}
          onClick={handleMenuClick}
        >
          <IoMenu className="h-5 w-5" />
        </Button>
        <Form {...form}>
          <form
            className="w-full items-center flex gap-2"
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              if (errors.email) {
                toast.error(errors.email.message);
              }
            })}
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
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-[#4A32B0] border-none hover:bg-[#4A32B0] hover:text-white text-white"
              variant={"outline"}
              size={"icon"}
            >
              <span className="pr-1 hidden sm:block">Submit</span>
              <IoIosSend className="h-5 w-5" />
            </Button>
          </form>
        </Form>
      </div>
    </Disclosure>
  );
};

export default AddFriend;
