
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useProfile } from '@/contexts/ProfileContext';
import { createSupportTicket } from '@/services/supportService';
import { toast } from '@/hooks/use-toast';

const supportTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(['low', 'medium', 'high', 'urgent'])
});

const SupportTicketForm = () => {
  const { profile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof supportTicketSchema>>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      subject: '',
      description: '',
      priority: 'low'
    }
  });

  const onSubmit = async (values: z.infer<typeof supportTicketSchema>) => {
    if (!profile?.wallet_address) {
      toast({
        title: "Error",
        description: "Please connect your wallet to submit a support ticket",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const ticket = await createSupportTicket({
        user_id: profile.wallet_address,
        subject: values.subject,
        description: values.description,
        priority: values.priority
      });

      if (ticket) {
        toast({
          title: "Ticket Submitted",
          description: "Your support ticket has been created successfully",
          variant: "default"
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit support ticket",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="What can we help you with?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide detailed information about your issue" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the urgency of your support request
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </Button>
      </form>
    </Form>
  );
};

export default SupportTicketForm;
