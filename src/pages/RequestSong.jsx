import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Music, Search, Check } from 'lucide-react';

export default function RequestSong() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [requesterName, setRequesterName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: () => base44.entities.Song.filter({ is_available: true }, '-play_count'),
  });

  const submitRequestMutation = useMutation({
    mutationFn: async (data) => {
      const request = await base44.entities.SongRequest.create(data);
      await base44.entities.Song.update(selectedSong.id, {
        play_count: (selectedSong.play_count || 0) + 1,
      });
      return request;
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSong || !requesterName.trim()) return;

    submitRequestMutation.mutate({
      song_id: selectedSong.id,
      song_title: selectedSong.title,
      requester_name: requesterName,
      message: message,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/95 backdrop-blur">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your song request for <span className="font-semibold">{selectedSong.title}</span> has been sent to the artist.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
              Request Another Song
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedSong) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">🎵 Requests a Song</h1>
            <p className="text-white/90 text-lg">Choose a song you'd like to hear</p>
          </div>

          <Card className="bg-white/95 backdrop-blur mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search songs or artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <Card className="bg-white/95 backdrop-blur">
              <CardContent className="py-12 text-center text-gray-500">
                Loading songs...
              </CardContent>
            </Card>
          ) : filteredSongs.length === 0 ? (
            <Card className="bg-white/95 backdrop-blur">
              <CardContent className="py-12 text-center text-gray-500">
                {searchQuery ? 'No songs found matching your search' : 'No songs available'}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSongs.map((song) => (
                <Card
                  key={song.id}
                  className="bg-white/95 backdrop-blur hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedSong(song)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{song.title}</h3>
                          <p className="text-gray-600 mt-1">{song.artist}</p>
                          {song.album && <p className="text-sm text-gray-500 mt-1">{song.album}</p>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant="outline" className="bg-purple-50">
                          {song.genre}
                        </Badge>
                        {song.play_count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {song.play_count} requests
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Request</CardTitle>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="font-semibold text-purple-900">{selectedSong.title}</p>
            <p className="text-sm text-purple-700">{selectedSong.artist}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name *</label>
              <Input
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Special Request (Optional)</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="E.g., Birthday shout out for John, Requesting for my friend Sarah, Anniversary dedication..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">Add birthday shout outs, dedications, or let us know who you're requesting for</p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedSong(null)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={submitRequestMutation.isPending}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {submitRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}