import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ArrowLeft, Award, Trophy, Plus, Gift, Star } from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  isRedeemed: boolean;
  redeemedDate?: Date;
  habitName?: string;
}

interface RewardManagerProps {
  rewards: Reward[];
  totalPoints: number;
  onBack: () => void;
  onRedeemReward: (rewardId: string) => void;
  onAddReward: (reward: { name: string; description: string; pointsCost: number; category: string }) => void;
}

const rewardCategories = [
  { name: 'Food & Treats', icon: '🍕', color: 'bg-red-500/20 text-red-400' },
  { name: 'Entertainment', icon: '🎬', color: 'bg-blue-500/20 text-blue-400' },
  { name: 'Shopping', icon: '🛍️', color: 'bg-purple-500/20 text-purple-400' },
  { name: 'Experiences', icon: '🎯', color: 'bg-green-500/20 text-green-400' },
  { name: 'Self Care', icon: '💆', color: 'bg-pink-500/20 text-pink-400' },
  { name: 'Other', icon: '🎁', color: 'bg-orange-500/20 text-orange-400' }
];

export function RewardManager({ rewards, totalPoints, onBack, onRedeemReward, onAddReward }: RewardManagerProps) {
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    pointsCost: 50,
    category: 'Other'
  });

  const availableRewards = rewards.filter(r => !r.isRedeemed);
  const redeemedRewards = rewards.filter(r => r.isRedeemed);

  const handleAddReward = () => {
    if (newReward.name && newReward.pointsCost > 0) {
      onAddReward(newReward);
      setNewReward({ name: '', description: '', pointsCost: 50, category: 'Other' });
      setIsAddingReward(false);
    }
  };

  const getCategoryInfo = (categoryName: string) => {
    return rewardCategories.find(c => c.name === categoryName) || rewardCategories[rewardCategories.length - 1];
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="border-orange-primary text-orange-primary hover:bg-orange-primary/10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-orange-primary">Reward Store</h1>
              <p className="text-muted-foreground">Redeem your hard-earned points for amazing rewards</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card p-3 rounded-lg border border-orange-primary/20">
              <Trophy className="h-5 w-5 text-orange-primary" />
              <span className="font-semibold">{totalPoints} Points Available</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-orange-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-primary/20 rounded-lg">
                  <Gift className="h-5 w-5 text-orange-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Rewards</p>
                  <p className="text-2xl font-bold">{availableRewards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-orange-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Redeemed</p>
                  <p className="text-2xl font-bold">{redeemedRewards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-orange-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-primary/20 rounded-lg">
                  <Trophy className="h-5 w-5 text-orange-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold">{totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Reward Button */}
        <div className="flex justify-end">
          <Dialog open={isAddingReward} onOpenChange={setIsAddingReward}>
            <DialogTrigger asChild>
              <Button className="bg-orange-primary hover:bg-orange-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add New Reward
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-orange-primary/20">
              <DialogHeader>
                <DialogTitle>Add New Reward</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reward-name">Reward Name</Label>
                  <Input
                    id="reward-name"
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                    placeholder="e.g., Favorite Coffee, New Book, Movie Night"
                    className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward-description">Description (Optional)</Label>
                  <Input
                    id="reward-description"
                    value={newReward.description}
                    onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                    placeholder="Add details about your reward..."
                    className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points-cost">Points Cost</Label>
                  <Input
                    id="points-cost"
                    type="number"
                    min="1"
                    value={newReward.pointsCost}
                    onChange={(e) => setNewReward({ ...newReward, pointsCost: parseInt(e.target.value) || 50 })}
                    className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {rewardCategories.map((category) => (
                      <button
                        key={category.name}
                        type="button"
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          newReward.category === category.name
                            ? 'border-orange-primary bg-orange-primary/10'
                            : 'border-gray-600 hover:border-orange-primary/50'
                        }`}
                        onClick={() => setNewReward({ ...newReward, category: category.name })}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddReward} className="flex-1 bg-orange-primary hover:bg-orange-secondary">
                    Add Reward
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingReward(false)} 
                          className="border-orange-primary text-orange-primary hover:bg-orange-primary/10">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Available Rewards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Rewards</h2>
          {availableRewards.length === 0 ? (
            <Card className="bg-card/50 border-dashed border-orange-primary/30">
              <CardContent className="p-8 text-center">
                <Gift className="h-12 w-12 text-orange-primary/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No rewards yet</h3>
                <p className="text-muted-foreground mb-4">Add some rewards to motivate yourself!</p>
                <Button onClick={() => setIsAddingReward(true)} className="bg-orange-primary hover:bg-orange-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Reward
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRewards.map((reward) => {
                const categoryInfo = getCategoryInfo(reward.category);
                const canAfford = totalPoints >= reward.pointsCost;
                
                return (
                  <Card key={reward.id} className={`bg-card/50 transition-all ${
                    canAfford ? 'border-orange-primary/40 hover:border-orange-primary' : 'border-gray-600/40'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{categoryInfo.icon}</span>
                          <div>
                            <CardTitle className="text-lg">{reward.name}</CardTitle>
                            {reward.description && (
                              <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={categoryInfo.color}>
                          {reward.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-orange-primary" />
                          <span className="font-semibold">{reward.pointsCost} points</span>
                        </div>
                        {reward.habitName && (
                          <Badge variant="outline" className="text-xs">
                            From: {reward.habitName}
                          </Badge>
                        )}
                      </div>

                      <Button 
                        onClick={() => onRedeemReward(reward.id)}
                        disabled={!canAfford}
                        className={`w-full ${
                          canAfford 
                            ? 'bg-orange-primary hover:bg-orange-secondary' 
                            : 'bg-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Award className="h-4 w-4 mr-2" />
                            Redeem Reward
                          </>
                        ) : (
                          <>
                            Need {reward.pointsCost - totalPoints} more points
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Redeemed Rewards */}
        {redeemedRewards.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Redeemed Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {redeemedRewards.map((reward) => {
                const categoryInfo = getCategoryInfo(reward.category);
                
                return (
                  <Card key={reward.id} className="bg-green-500/5 border-green-500/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{categoryInfo.icon}</span>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {reward.name}
                              <Star className="h-4 w-4 text-green-500" />
                            </CardTitle>
                            {reward.description && (
                              <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-400">✅ Redeemed</span>
                        <span className="text-muted-foreground">
                          {reward.redeemedDate?.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}