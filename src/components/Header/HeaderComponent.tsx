import { Trophy } from "lucide-react"
import { Profile } from "../profile/Profile";

const HeaderComponent = ({ totalPoints }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-orange-primary">HabitQuest</h1>
        <p className="text-muted-foreground">Level up your life, one habit at a time</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-card p-3 rounded-lg border border-orange-primary/20">
          <Trophy className="h-5 w-5 text-orange-primary" />
          <span className="font-semibold">{totalPoints} Points</span>
        </div>
        <Profile></Profile>
      </div>
    </div>
  )
}

export default HeaderComponent;