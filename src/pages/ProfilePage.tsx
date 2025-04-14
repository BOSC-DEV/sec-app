import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { Twitter, Globe, Camera, Upload, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OptimizedImage from '@/components/common/OptimizedImage';

interface ProfileFormValues {
  display_name: string;
  username: string;
  bio: string;
  x_link: string;
  website_link: string;
}

const ProfilePage = () => {
  const {
    isConnected,
    walletAddress,
    profile,
    isLoading,
    refreshProfile,
    uploadAvatar,
    disconnectWallet,
    updateProfile
  } = useProfile();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      display_name: '',
      username: '',
      bio: '',
      x_link: '',
      website_link: ''
    }
  });

  useEffect(() => {
    if (!isConnected && !isLoading) {
      navigate('/');
    }
  }, [isConnected, isLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.profile_pic_url || null);
      form.reset({
        display_name: profile.display_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        x_link: profile.x_link || '',
        website_link: profile.website_link || ''
      });
    }
  }, [profile, form]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/');
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected'
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 2MB',
        variant: 'destructive'
      });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive'
      });
      return;
    }
    try {
      const publicUrl = await uploadAvatar(file);
      if (publicUrl) {
        setAvatarUrl(publicUrl);
        setAvatarKey(Date.now());
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload profile picture',
        variant: 'destructive'
      });
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!walletAddress || !profile) return;
    try {
      setIsSaving(true);
      const updatedProfile = await updateProfile({
        ...profile,
        display_name: data.display_name,
        username: data.username,
        bio: data.bio,
        x_link: data.x_link,
        website_link: data.website_link,
        profile_pic_url: avatarUrl || profile.profile_pic_url
      });
      if (data.username) {
        navigate(`/${data.username}?t=${Date.now()}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="container py-10">
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
      </div>;
  }

  const isNewProfile = !profile;
  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || '👤';
  };

  return <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {isNewProfile ? 'Create Your Profile' : 'Edit Your Profile'}
              </CardTitle>
              <CardDescription>
                {isNewProfile ? 'Complete your profile to start participating in the community' : 'Update your profile information'}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect} className="text-icc-red border-icc-red-light hover:text-icc-red flex items-center gap-2 bg-neutral-50">
              <LogOut className="h-4 w-4" /> Disconnect
            </Button>
          </div>
          {walletAddress && <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Wallet: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </Badge>
            </div>}
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 cursor-pointer" key={avatarKey}>
                {avatarUrl ? <AvatarImage src={`${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}v=${avatarKey}`} alt="Profile" /> : <AvatarFallback className="bg-icc-blue text-white text-xl">
                    {getInitials(form.getValues().display_name)}
                  </AvatarFallback>}
              </Avatar>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarClick}>
                <Camera className="h-8 w-8 text-white" />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="display_name" render={({
              field
            }) => <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your display name" {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <FormField control={form.control} name="username" render={({
              field
            }) => <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your profile will be accessible at sec.digital/
                    </FormDescription>
                  </FormItem>} />
              
              <FormField control={form.control} name="bio" render={({
              field
            }) => <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself" className="min-h-[120px]" {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Links</h3>
                
                <FormField control={form.control} name="x_link" render={({
                field
              }) => <FormItem>
                      <div className="flex items-center">
                        <Twitter className="mr-2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="X (Twitter) URL" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>} />
                
                <FormField control={form.control} name="website_link" render={({
                field
              }) => <FormItem>
                      <div className="flex items-center">
                        <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="Website URL" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>} />
              </div>
              
              <CardFooter className="flex justify-between px-0 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-icc-gold hover:bg-icc-gold-light text-icc-blue" disabled={isSaving}>
                  {isSaving ? 'Saving...' : isNewProfile ? 'Create Profile' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>;
};

export default ProfilePage;
