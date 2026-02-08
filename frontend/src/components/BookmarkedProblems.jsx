import React, { useEffect } from 'react';
import { useInteractionStore } from '../store/useInteractionStore';
import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, Trash2 } from 'lucide-react';
import EmptyState from './EmptyState';

const BookmarkedProblems = () => {
    const { userBookmarks, getUserBookmarks, removeBookmark, isLoading } = useInteractionStore();

    useEffect(() => {
        getUserBookmarks();
    }, [getUserBookmarks]);

    const getDifficultyBadge = (difficulty) => {
        switch (difficulty) {
            case 'EASY':
                return <span className="badge badge-success">Easy</span>;
            case 'MEDIUM':
                return <span className="badge badge-warning">Medium</span>;
            case 'HARD':
                return <span className="badge badge-error">Hard</span>;
            default:
                return <span className="badge">Unknown</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 bg-base-200">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-primary mb-6">Bookmarked for Revision</h2>
                    <div className="flex justify-center items-center h-32">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-base-200">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Bookmark className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-primary">Bookmarked for Revision</h2>
                </div>

                {userBookmarks.length === 0 ? (
                    <EmptyState
                        type="playlists"
                        title="No bookmarks yet"
                        description="Bookmark problems you want to revisit later for practice."
                    />
                ) : (
                    <div className="card bg-base-100 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th className="bg-base-300">Problem</th>
                                        <th className="bg-base-300">Difficulty</th>
                                        <th className="bg-base-300">Note</th>
                                        <th className="bg-base-300 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userBookmarks.map((bookmark) => (
                                        <tr key={bookmark.id} className="hover">
                                            <td className="font-medium">{bookmark.problem?.title}</td>
                                            <td>{getDifficultyBadge(bookmark.problem?.difficulty)}</td>
                                            <td className="max-w-xs truncate text-base-content/70">
                                                {bookmark.note || "-"}
                                            </td>
                                            <td className="flex justify-center gap-2">
                                                <Link
                                                    to={`/problem/${bookmark.problem?.id}`}
                                                    className="btn btn-sm btn-primary gap-1"
                                                >
                                                    <ExternalLink size={14} />
                                                    Solve
                                                </Link>
                                                <button
                                                    onClick={() => removeBookmark(bookmark.problem?.id)}
                                                    className="btn btn-sm btn-ghost text-error"
                                                    title="Remove Bookmark"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarkedProblems;
