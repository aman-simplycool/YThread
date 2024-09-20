"use client";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounceCallback } from 'usehooks-ts';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

export function CreateCommunityPage() {
  const [category, setCategory] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [isCheckingCommunityName, setIsCheckingCommunityName] = useState(false);
  const [uniqueResMessage, setUniqueResMessage] = useState('');
  const debounced = useDebounceCallback(setCommunityName, 500);
  const { toast } = useToast();
  const {data:session,status} = useSession();
  const[user,setUser] = useState({});
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { communityName, category,userName:user};
      const response = await axios.post('/api/createCommunity', data);
      if (response.data.success) {
        toast({
          title: "Community page created successfully",
          variant: 'default',
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: 'destructive',
      });
    }
  };
  useEffect(()=>{
      setUser(session?.user.userName);
  },[session,status])
  useEffect(() => {
    const isUserNameUnique = async () => {
      if (communityName) {
        setUniqueResMessage('');
        setIsCheckingCommunityName(true);
        try {
          const response = await axios.get(`/api/communityNameUnique?communityName=${communityName}`);
          setUniqueResMessage(response.data.message);
        } catch (error) {
          toast({
            title: "Something went wrong",
            variant: 'destructive',
          });
        } finally {
          setIsCheckingCommunityName(false);
        }
      }
    };
    isUserNameUnique();
  }, [communityName, toast]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">start a community</Button>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Edit Community</SheetTitle>
            <SheetDescription>
              Make changes to your community here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="communityName" className="text-right">
                Community Name
              </Label>
              <Input
                id="communityName"
                value={communityName}
                onChange={(e) => { setCommunityName(e.target.value); debounced(e.target.value); }}
                className="col-span-3"
              />
              {isCheckingCommunityName && <Loader2 className="animate-spin" />}
              {!isCheckingCommunityName && uniqueResMessage && (
                <p
                  className={`text-sm ${uniqueResMessage === 'yepp! this name is available'
                    ? 'text-green-500'
                    : 'text-red-500'
                    }`}
                >
                  {uniqueResMessage}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
