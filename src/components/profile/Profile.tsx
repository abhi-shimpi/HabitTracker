import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getDataFromLocalStorage, removeDatafromLocalstorage } from '../../services/localStorageService';
import endpoints from '../../utils/endpoints';
import { callPostApi } from '../../services/apiServices';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function Profile() {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    let userData: any = JSON.parse(getDataFromLocalStorage('userData') ?? '') ?? {};

    let initials = `${userData?.firstName?.charAt(0)}${userData?.lastName?.charAt(0)}`?.toUpperCase() ?? '';
    let fullName = `${userData?.firstName} ${userData?.lastName}`;
    let daysSinceJoined = Math.floor(
        (new Date().getTime() - new Date(userData.joinedDate)?.getTime()) / (1000 * 60 * 60 * 24)
    ) ?? 0;

    console.log("userData", userData);

    useEffect(() => {
        return () => {
            
        };
    }, []);

    const onViewProfile = () => {

    }

    const onLogout = async () => {
        setLoader(true);

        try {
            const response = await callPostApi(`${endpoints.LOGOUT}`, {});
            toast.success("Successfully created habit!");
            navigate('/login');
            removeDatafromLocalstorage('userData')
            console.log(response);
            setLoader(false);
        } catch (error) {
            console.error(error);
            setLoader(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-card/50 transition-all border border-transparent hover:border-orange-primary/30 group"
                >
                    <Avatar className="h-9 w-9 border-2 border-orange-primary/50 group-hover:border-orange-primary transition-colors">
                        <AvatarFallback className="bg-orange-primary text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm text-foreground group-hover:text-orange-primary transition-colors">
                            {fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Quest Master
                        </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-orange-primary transition-colors hidden md:block" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-72 bg-card border-orange-primary/30 shadow-xl"
                align="end"
                sideOffset={8}
            >
                {/* User Info Section */}
                <DropdownMenuLabel className="pb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-orange-primary">
                            <AvatarFallback className="bg-orange-primary text-white text-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-foreground">
                                {fullName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {userData.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                {/* User Stats */}
                <div className="px-2 py-3 bg-orange-primary/5 border-y border-orange-primary/20">
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Member for</span>
                            <span className="text-orange-primary">
                                {daysSinceJoined} {daysSinceJoined === 1 ? 'day' : 'days'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Status</span>
                            <span className="text-success">Active</span>
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator className="bg-border" />

                {/* View Profile Option */}
                <DropdownMenuItem
                    onClick={onViewProfile}
                    className="cursor-pointer py-3 focus:bg-orange-primary/10 focus:text-orange-primary"
                >
                    <User className="mr-3 h-4 w-4" />
                    <div className="flex flex-col">
                        <span>View Profile</span>
                        <span className="text-xs text-muted-foreground">
                            Manage your account settings
                        </span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />

                {/* Settings Option (placeholder for future) */}
                <DropdownMenuItem
                    className="cursor-pointer py-3 focus:bg-orange-primary/10 focus:text-orange-primary opacity-50 cursor-not-allowed"
                    disabled
                >
                    <Settings className="mr-3 h-4 w-4" />
                    <div className="flex flex-col">
                        <span>Settings</span>
                        <span className="text-xs text-muted-foreground">
                            Coming soon
                        </span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border" />

                {/* Logout Option */}
                <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer py-3 focus:bg-destructive/10 focus:text-destructive text-destructive"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <div className="flex flex-col">
                        <span>Logout</span>
                        <span className="text-xs text-muted-foreground">
                            Sign out of your account
                        </span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
