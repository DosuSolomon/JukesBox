import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music, Plus, Trash2, Bell, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddSongDialog from '../components/request/AddSongDialog';
import RequestQueue from '../components/request/RequestQueue';

export default function ArtistDashboard() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const queryClient = useQueryClient();
  
  const requestPageUrl = window.location.origin + createPageUrl('RequestSong');

  const { data: songs = [], isLoading: loadingSongs } = useQuery({
    queryKey: ['songs'],
    queryFn: () => base44.entities.Song.list('-created_date'),
  });

  const { data: requests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ['requests'],
    queryFn: () => base44.entities.SongRequest.filter({ status: 'pending' }, '-created_date'),
    refetchInterval: 3000,
  });

  const deleteSongMutation = useMutation({
    mutationFn: (id) => base44.entities.Song.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['songs'] }),
  });

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'song-request-qr.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Artist Dashboard</h1>
          <Badge className="bg-purple-600 text-white">
            <Bell className="w-4 h-4 mr-1" />
            {requests.length} Pending
          </Badge>
        </div>

        <Tabs defaultValue="qr" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="songs">Song Library</TabsTrigger>
            <TabsTrigger value="requests">Request Queue</TabsTrigger>
          </TabsList>

          <TabsContent value="qr">
            <Card className="bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Your Song Request QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <QRCodeSVG
                    id="qr-code"
                    value={requestPageUrl}
                    size={300}
                    level="H"
                    includeMargin
                  />
                </div>
                <p className="text-sm text-gray-600 text-center max-w-md">
                  Share this QR code with your audience. When scanned, they'll be able to request songs from your library.
                </p>
                <Button onClick={downloadQR} className="bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="songs">
            <Card className="bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Song Library ({songs.length})</CardTitle>
                  <Button onClick={() => setShowAddDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Song
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingSongs ? (
                  <p className="text-gray-500">Loading songs...</p>
                ) : songs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No songs yet. Add your first song!</p>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(
                      songs.reduce((acc, song) => {
                        const genre = song.genre || 'other';
                        if (!acc[genre]) acc[genre] = [];
                        acc[genre].push(song);
                        return acc;
                      }, {})
                    ).map(([genre, genreSongs]) => (
                      <div key={genre}>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 capitalize flex items-center gap-2">
                          <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
                          {genre.replace(/_/g, ' ')} ({genreSongs.length})
                        </h3>
                        <div className="grid gap-3">
                          {genreSongs.map((song) => (
                            <div
                              key={song.id}
                              className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center gap-4">
                                <Music className="w-5 h-5 text-purple-600" />
                                <div>
                                  <h3 className="font-semibold">{song.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    {song.artist} {song.album && `• ${song.album}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge>{song.play_count || 0} requests</Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteSongMutation.mutate(song.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <RequestQueue requests={requests} />
          </TabsContent>
        </Tabs>

        <AddSongDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
      </div>
    </div>
  );
}