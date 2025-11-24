/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button, Paragraph } from "@components/index";
import { ModalContent, ModalHeader, ModalProps, ModalRoot, ModalSize } from "@utils/modal";
import { SettingsRouter, TextInput, useEffect, useState } from "@webpack/common";

interface Props {
    props: ModalProps;
    onSelect: (url: string) => void;
    initialUrl: string | undefined;
}

export function SetWallpaperModal({ props, onSelect, initialUrl }: Props) {
    const [url, setUrl] = useState(initialUrl ?? "");
    const [cspError, setCspError] = useState(false);

    useEffect(() => {
        const handler = (event: SecurityPolicyViolationEvent) => {
            if (event.effectiveDirective !== "img-src" || !event.blockedURI) return;
            setCspError(true);
        };

        document.addEventListener("securitypolicyviolation", handler);

        return () => {
            document.removeEventListener("securitypolicyviolation", handler);
        };
    }, []);

    return (
        <ModalRoot {...props} size={ModalSize.SMALL}>
            <ModalHeader>
                <Paragraph size="lg" style={{ marginBottom: 8 }}>
                    Set wallpaper
                </Paragraph>
            </ModalHeader>
            <ModalContent>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
                    <Paragraph>The image url</Paragraph>
                    <TextInput
                        value={url}
                        onChange={u => {
                            setUrl(u);
                            setCspError(false);
                        }}
                        autoFocus
                    />
                    {cspError && (
                        <>

                            <Paragraph style={{ color: "var(--text-danger)" }}>
                                Uh oh! The image URL you provided is not allowed by the Content Security Policy. You can allow it in the Vencord Theme settings!
                            </Paragraph>
                            <Button
                                onClick={() => { props.onClose(); SettingsRouter.open("VencordThemes"); }}
                            >
                                Open Theme Settings
                            </Button>
                        </>
                    )}
                    {url && !cspError && (
                        <img
                            src={url}
                            style={{
                                display: "block",
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                                borderRadius: 8
                            }}
                        />
                    )}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={props.onClose}>Cancel</Button>
                        <Button
                            onClick={() => {
                                onSelect(url);
                                props.onClose();
                            }}
                            disabled={!url || cspError}
                        >Apply</Button>
                    </div>
                </div>
            </ModalContent>
        </ModalRoot >
    );
}
