import React, { useEffect, useState } from "react";

const ProtectedImage = ({
    src,
    alt = "",
    className = "",
    style = {},
}) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let objectUrl = null;
        let cancelled = false;

        const loadImage = async () => {
            if (!src) {
                setLoading(false);
                setImageSrc(null);
                return;
            }

            try {
                setLoading(true);
                setImageSrc(null);

                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Authentication token not found.");
                }

                const response = await fetch(src, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token} `,
                        Accept: "image/*",
                    },
                });

                if (!response.ok) {
                    throw new Error(
                        `Image request failed with status ${response.status} `
                    );
                }

                const blob = await response.blob();

                objectUrl = URL.createObjectURL(blob);

                if (!cancelled) {
                    setImageSrc(objectUrl);
                }
            } catch (error) {
                console.error(
                    "Failed to load protected image:",
                    error
                );

                if (!cancelled) {
                    setImageSrc(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadImage();

        return () => {
            cancelled = true;

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]);

    // Loading state
    if (loading) {
        return (
            <div
                className={`d - flex align - items - center justify - content - center bg - light border ${className} `}
                style={style}
            >
                <div
                    className="spinner-border text-primary"
                    role="status"
                    aria-label="Loading image"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    // Error state
    if (!imageSrc) {
        return (
            <div
                className={`d - flex align - items - center justify - content - center bg - light border text - muted ${className} `}
                style={style}
            >
                Unable to load image
            </div>
        );
    }

    // Image loaded
    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={style}
        />
    );
};

export default ProtectedImage;