import React, { useState } from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Link, Clock, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const URLShortener = () => {
  const [url, setUrl] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [expirationTime, setExpirationTime] = useState("12:00");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const longUrl = encodeURIComponent("https://example.com");
      await fetch(`/api?long_url=${longUrl}`, {
        method: "POST"
      })
        .then(res => res.json())
        .then(data => {
          console.log("Response:", data);
      });
      // Simulating API call with timeout
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random short code (in real app, this would come from backend)
      const shortCode = Math.random().toString(36).substring(2, 8);
      setShortUrl(`https://short.url/${shortCode}`);
      
      toast({
        title: "Success!",
        description: "Your URL has been shortened",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast({
      description: "Copied to clipboard!",
    });
  };

  // Generate time options every 30 minutes
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const formatDateTime = (date?: Date, time = "00:00") => {
    if (!date) return "Pick a date and time";
    const [hours, minutes] = time.split(":");
    const dateWithTime = new Date(date);
    dateWithTime.setHours(parseInt(hours), parseInt(minutes));
    return format(dateWithTime, "PPP 'at' HH:mm") + " UTC";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">URL Shortener</h1>
          <p className="text-gray-600">Shorten your long URLs with ease</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">Enter your long URL</Label>
            <div className="flex">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very-long-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Expiration (Optional)</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={setExpirationDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={expirationTime}
                onValueChange={setExpirationTime}
                disabled={!expirationDate}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {expirationDate && (
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Expires: {formatDateTime(expirationDate, expirationTime)}
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <p className="text-sm">
                      All expiration times are in Coordinated Universal Time (UTC). 
                      Please convert to your local time zone as needed.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </Button>
        </form>

        {shortUrl && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Label>Your shortened URL</Label>
            <div className="flex mt-2">
              <Input
                value={shortUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="ml-2"
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default URLShortener;
