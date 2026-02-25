import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Music } from 'lucide-react';
import { format } from 'date-fns';

export default function RequestQueue({ requests }) {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.SongRequest.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  if (requests.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur">
        <CardContent className="py-12 text-center text-gray-500">
          No pending requests. When someone requests a song, it will appear here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle>Request Queue ({requests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{request.song_title}</h3>
                    <p className="text-sm text-gray-600">Requested by {request.requester_name}</p>
                    {request.message && (
                      <p className="text-sm text-gray-500 mt-1 italic">"{request.message}"</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {format(new Date(request.created_date), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => updateStatusMutation.mutate({ id: request.id, status: 'playing' })}
                  disabled={updateStatusMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Playing Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => updateStatusMutation.mutate({ id: request.id, status: 'declined' })}
                  disabled={updateStatusMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}