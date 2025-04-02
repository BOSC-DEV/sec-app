
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { saveProfile } from '@/services/profileService';
import { Twitter, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ProfileFormValues {
  display_name: string;
  username: string;
  bio: string;
  x_link: string;
  website_link: string;
}

const ProfilePage = () => {
  const { isConnected, walletAddress, profile, isLoading, refreshProfile } = useProfile();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      display_name: '',
      username: '',
      bio: '',
      x_link: '',
      website_link: '',
    },
  });

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected && !isLoading) {
      navigate('/');
    }
  }, [isConnected, isLoading, navigate]);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      form.reset({
        display_name: profile.display_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        x_link: profile.x_link || '',
        website_link: profile.website_link || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!walletAddress) return;
    
    try {
      setIsSaving(true);
      
      await saveProfile({
        ...profile,
        id: profile?.id || crypto.randomUUID(),
        wallet_address: walletAddress,
        display_name: data.display_name,
        username: data.username,
        bio: data.bio,
        x_link: data.x_link,
        website_link: data.website_link,
        created_at: profile?.created_at || new Date().toISOString(),
      });
      
      await refreshProfile();
      
      toast({
        title: 'Profile Saved',
        description: 'Your profile has been updated successfully',
      });
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-icc-gold mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isNewProfile = !profile;

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isNewProfile ? 'Create Your Profile' : 'Edit Your Profile'}
          </CardTitle>
          <CardDescription>
            {isNewProfile 
              ? 'Complete your profile to start participating in the community' 
              : 'Update your profile information'}
          </CardDescription>
          {walletAddress && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Wallet: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your display name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your profile will be accessible at bookofscams.lol/
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Links</h3>
                
                <FormField
                  control={form.control}
                  name="x_link"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <Twitter className="mr-2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="X (Twitter) URL" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website_link"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="Website URL" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <CardFooter className="flex justify-between px-0 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-icc-gold hover:bg-icc-gold-light text-icc-blue"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : isNewProfile ? 'Create Profile' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
