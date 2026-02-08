import React from "react";
import { FileQuestion, Search, Inbox, BookOpen, Code, Users, FolderOpen } from "lucide-react";

const iconMap = {
    problems: FileQuestion,
    search: Search,
    inbox: Inbox,
    submissions: Code,
    playlists: FolderOpen,
    solved: BookOpen,
    users: Users,
};

const EmptyState = ({
    type = "inbox",
    title = "No data found",
    description = "There's nothing here yet.",
    action = null,
    actionLabel = "Get Started"
}) => {
    const Icon = iconMap[type] || Inbox;

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-base-200 rounded-full p-6 mb-4">
                <Icon className="w-12 h-12 text-base-content/50" />
            </div>
            <h3 className="text-lg font-semibold text-base-content mb-2">{title}</h3>
            <p className="text-base-content/60 text-sm max-w-md mb-4">{description}</p>
            {action && (
                <button onClick={action} className="btn btn-primary btn-sm">
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
