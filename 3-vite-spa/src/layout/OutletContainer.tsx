import { Box, Container, LinearProgress, Typography } from "@mui/material";
import React from "react";

function OutletContainer({
    title,
    children,
    isLoading = false,
}: {
    title: string;
    children: React.ReactNode;
    isLoading?: boolean;
}) {
    return (
        <div>
            {isLoading && <LinearProgress color="secondary" />}
            <Box mt={3}>
                <Container maxWidth="md">
                    <Box mb={3}>
                        <Typography variant="h4">{title}</Typography>
                    </Box>
                    <Box>{children}</Box>
                </Container>
            </Box>
        </div>
    );
}

export default OutletContainer;
