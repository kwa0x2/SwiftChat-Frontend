import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UsernameSchemas } from "@/schemas/username";
import { updateUsernameByMail } from "@/app/api/services/user.Service";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface ProfileFormProps {
  user: any;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const { update } = useSession(); // Get the update function from session

    // Initialize the form with Zod validation schema
  const form = useForm<z.infer<typeof UsernameSchemas>>({
    resolver: zodResolver(UsernameSchemas),
    defaultValues: {
      username: user.name ?? "",
    },
  });

  // #region Handle form submission
  const onSubmit = async (data: z.infer<typeof UsernameSchemas>) => {
    if (user.name === data.username) {
      toast.warning("Please enter a different name to update."); // Notify user if no change
      return; // Exit early to avoid unnecessary API call
    }

    // Call the API to update the username
    const res = await updateUsernameByMail(data.username);
    if (res.status === 200) {
      toast.success("Username updated successfully!"); // Success message
      await update(); // Refresh the session
    } else {
      toast.error(
        "An unknown error occurred while updating the username. Please try again."
      ); // Error message
    }
  };
  // #endregion

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Please enter username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field (disabled) */}
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder={user.email} disabled />
          </FormControl>
          <FormDescription>
            This email belongs to your Google account and cannot be changed.
          </FormDescription>
          <FormMessage />
        </FormItem>

        {/* Submit Button */}
        <Button type="submit" variant={"outline"}>
          Update Profile
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
