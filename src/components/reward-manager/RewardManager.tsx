import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ArrowLeft, Award, Trophy, Plus, Gift, Star } from 'lucide-react';
import { dummyRewardData } from '../../utils/dummyData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import endpoints from '../../utils/endpoints';
import { callGetApi, callPatchApi, callPostApi } from '../../services/apiServices';
import { Reward } from '../../utils/interfaces';
import { ApiLoader } from '../ui/loader';
import { rewardCategories } from '../../utils/constants';
import { ThreeDotsLoader } from '../ui/three-dots-loader';
import LoaderExample from '../ui/LoaderExample';
import { setLoader, clearLoader } from '../../store/loaderSlice';
import { defaultRewardImageUrl } from '../../utils/constants';
import { useDispatch } from 'react-redux';


export function RewardManager() {
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [totalPoints, setTotalPoints] = useState(200);
  const [showThreeDotsLoader, setShowThreeDotsLoader] = useState(false);
  const navigate = useNavigate();
  const [redeemedRewards, setRedeemedRewards] = useState<Reward[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [loaderMessage, setMessage] = useState<string>('Loading your reward manager...');

  const dispatch = useDispatch();
  const [newReward, setNewReward] = useState({
    name: '',
    rewardLink: '',
    rewardCost: 0,
    productImageUrl: defaultRewardImageUrl,
    rewardPoints: 50,
    rewardCategory: 'other'
  });

  async function getGeneralRewards() {
    dispatch(setLoader({
      loading: true,
      message: 'Loading your general rewards...'
    }));
    try {
      const response = await callGetApi(`${endpoints.GENERAL_REWARDS}`, {});
      console.log(response?.data);

      // Transform API response to match our Reward interface
      const transformedRewards = (response?.data || []).map((reward: any) => ({
        id: reward._id,
        name: reward.rewardName,
        rewardLink: reward.rewardLink,
        rewardCost: reward.costPrice,
        productImageUrl: reward.productImageUrl && reward.productImageUrl.trim() !== '' ? reward.productImageUrl : defaultRewardImageUrl,
        rewardPoints: reward.finalPointsToEarn,
        rewardCategory: reward.rewardCategory,
        isRedeemed: reward.isRedeemed,
        redeemedDate: reward.redeemedDate ? new Date(reward.redeemedDate) : undefined,
        habitName: reward.habitName
      }));

      setAvailableRewards(transformedRewards);
    } catch (error) {
      console.error(error);
      dispatch(clearLoader());
      toast.error(error?.response?.data?.message || 'Failed to get rewards!');
    } finally {
      dispatch(clearLoader());
    }
  }
  console.log(defaultRewardImageUrl);
  console.log(availableRewards);
  async function getRedeemedRewards() {
    dispatch(setLoader({
      loading: true,
      message: 'Loading your redeemed rewards...'
    }));
    try {
      const response = await callGetApi(`${endpoints.REDEEMED_REWARDS}`, {});
      console.log(response?.data);

      // Transform API response to match our Reward interface
      const transformedRewards = (response?.data || []).map((reward: any) => ({
        id: reward._id,
        name: reward.rewardName,
        rewardLink: reward.rewardLink,
        rewardCost: reward.costPrice,
        productImageUrl: reward.productImageUrl && reward.productImageUrl.trim() !== '' ? reward.productImageUrl : defaultRewardImageUrl,
        rewardPoints: reward.finalPointsToEarn,
        rewardCategory: reward.rewardCategory,
        isRedeemed: reward.isRedeemed,
        redeemedDate: reward.redeemedDate ? new Date(reward.redeemedDate) : undefined,
        habitName: reward.habitName
      }));

      setRedeemedRewards(transformedRewards);
    }
    catch (error) {
      console.error(error);
      dispatch(clearLoader());
      toast.error(error?.response?.data?.message || 'Failed to get redeemed rewards!');
    }
    finally {
      dispatch(clearLoader());
    }
  }

  useEffect(() => {
    getGeneralRewards();
    getRedeemedRewards();
  }, []);


  const onBack = () => {
    // Navigate back to dashboard or previous view  
    navigate('/dashboard');
  }

  const handleRedeemReward = async (rewardId: string) => {
    setShowThreeDotsLoader(true);
    try {
      const response = await callPatchApi(endpoints.REDEEM_GENERAL_REWARD, { rewardId: rewardId });
      if (response?.data) {
        toast.success("Reward redeemed successfully!");
        getGeneralRewards();
        getRedeemedRewards();
      } else {
        toast.error("Failed to redeem reward!");
      }
      setShowThreeDotsLoader(false);
    } catch (error) {
      console.error(error);
      setShowThreeDotsLoader(false);
      toast.error("Failed to redeem reward!");
    }
  }

  const isFormDataValid = () => {
    return (
      newReward.name.trim() !== '' &&
      newReward.rewardCost > 0 &&
      newReward.rewardPoints > 0 &&
      newReward.rewardCategory !== ''
    );
  };

  const handleAddReward = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormDataValid()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setShowThreeDotsLoader(true);
    try {
      const rewardData = {
        rewardName: newReward.name,
        rewardLink: newReward.rewardLink,
        costPrice: newReward.rewardCost,
        productImageUrl: newReward.productImageUrl,
        finalPointsToEarn: newReward.rewardPoints,
        rewardCategory: newReward.rewardCategory
      };

      const response = await callPostApi(endpoints.CREATE_REWARD, rewardData);
      console.log('Reward created successfully:', response?.data);
      toast.success('Reward created successfully!');

      // Reset form
      setNewReward({
        name: '',
        rewardLink: '',
        rewardCost: 0,
        productImageUrl: defaultRewardImageUrl,
        rewardPoints: 50,
        rewardCategory: 'other'
      });
      setIsAddingReward(false);
      setShowThreeDotsLoader(false);
      // Refresh rewards list
      getGeneralRewards();
    } catch (error: any) {
      console.error('Error creating reward:', error);
      toast.error(error?.response?.data?.message || 'Failed to create reward!');
      setShowThreeDotsLoader(false);
    }
  };

  const getCategoryInfo = (categoryValue: string) => {
    return rewardCategories.find(c => c.value === categoryValue) || rewardCategories[rewardCategories.length - 1];
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-6xl mx-auto space-y-6">
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
            <Button className="cursor-pointer bg-orange-primary hover:bg-orange-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add New Reward
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-orange-primary/20">
            <DialogHeader>
              <DialogTitle>Add New Reward</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddReward} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reward-name">Reward Name *</Label>
                <Input
                  id="reward-name"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  placeholder="e.g., Favorite Coffee, New Book, Movie Night"
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-link">Reward Link</Label>
                <Input
                  id="reward-link"
                  type="url"
                  value={newReward.rewardLink}
                  onChange={(e) => setNewReward({ ...newReward, rewardLink: e.target.value })}
                  placeholder="e.g., Amazon link, Restaurant website"
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-cost">Reward Cost *</Label>
                <Input
                  id="reward-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newReward.rewardCost}
                  onChange={(e) => setNewReward({ ...newReward, rewardCost: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-image-url">Product Image URL</Label>
                <Input
                  id="product-image-url"
                  type="url"
                  value={newReward.productImageUrl}
                  onChange={(e) => setNewReward({ ...newReward, productImageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-points">Reward Points *</Label>
                <Input
                  id="reward-points"
                  type="number"
                  min="1"
                  value={newReward.rewardPoints}
                  onChange={(e) => setNewReward({ ...newReward, rewardPoints: parseInt(e.target.value) || 50 })}
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {rewardCategories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      className={`p-3 rounded-lg border-2 text-left transition-all ${newReward.rewardCategory === category.value
                        ? 'border-orange-primary bg-orange-primary/10'
                        : 'border-gray-600 hover:border-orange-primary/50'
                        }`}
                      onClick={() => setNewReward({ ...newReward, rewardCategory: category.value })}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium">{category.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={showThreeDotsLoader}
                  className="flex-1 bg-orange-primary hover:bg-orange-secondary"
                >
                  {showThreeDotsLoader ? 'Adding...' : 'Add Reward'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingReward(false)}
                  disabled={showThreeDotsLoader}
                  className="border-orange-primary text-orange-primary hover:bg-orange-primary/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
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
              const categoryInfo = getCategoryInfo(reward.rewardCategory);
              const canAfford = totalPoints >= reward.rewardPoints;

              return (
                <Card key={reward.id} className={`bg-card/50 transition-all gap-0 ${canAfford ? 'border-orange-primary/40 hover:border-orange-primary' : 'border-gray-600/40'
                  }`}>
                  <div className="block">
                    <CardHeader className="pb-3 gap-4 items-center">
                      {/* Product Image */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
                        <img
                          src={reward.productImageUrl}
                          alt={reward.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = defaultRewardImageUrl;
                          }}
                        />
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div>
                            <CardTitle className="text-lg">{reward.name}</CardTitle>
                            {reward.rewardCost > 0 && (
                              <p className="text-sm text-muted-foreground mt-1">Cost: Rs{reward.rewardCost}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={categoryInfo.color}>
                          {categoryInfo.text}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-orange-primary" />
                          <span className="font-semibold">{reward.rewardPoints} points</span>
                        </div>
                        {reward.habitName && (
                          <Badge variant="outline" className="text-xs">
                            From: {reward.habitName}
                          </Badge>
                        )}
                      </div>

                      {/* Reward Link */}
                      {reward.rewardLink && (
                        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                          <span className="text-xs text-orange-600 font-medium">🔗 Product Link:</span>
                          <a
                            href={reward.rewardLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange-600 hover:text-orange-800 underline truncate flex-1"
                          >
                            View Product
                          </a>
                        </div>
                      )}

                      <Button
                        onClick={() => handleRedeemReward(reward.id)}
                        disabled={!canAfford}
                        className={`w-full ${canAfford
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
                            Need {reward.rewardPoints - totalPoints} more points
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </div>
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
              const categoryInfo = getCategoryInfo(reward.rewardCategory);

              return (
                <Card key={reward.id} className="bg-green-500/5 border-green-500/20">
                  <div className="block">
                    {/* Product Image */}
                    <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
                      <img
                        src={reward.productImageUrl}
                        alt={reward.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {reward.name}
                              <Star className="h-4 w-4 text-green-500" />
                            </CardTitle>
                            {reward.rewardCost > 0 && (
                              <p className="text-sm text-muted-foreground mt-1">Cost: Rs{reward.rewardCost}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Reward Link */}
                      {reward.rewardLink && (
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-xs text-green-600 font-medium">🔗 Product Link:</span>
                          <a
                            href={reward.rewardLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-600 hover:text-green-800 underline truncate flex-1"
                          >
                            View Product
                          </a>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-400">✅ Redeemed</span>
                        <span className="text-muted-foreground">
                          {reward.redeemedDate?.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}