import { AppBar, Box, IconButton, Menu, MenuItem, styled, Toolbar, Tooltip, Typography, useScrollTrigger } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings'
import MoreIcon from '@mui/icons-material/MoreVertOutlined'
import GitHub from '@mui/icons-material/GitHub'
import AccountCircle from '@mui/icons-material/AccountCircle'
import React, { ReactElement } from "react";
import SettingsDialog from "./SettingsDialog";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    '@media (min-width: 600px)': {
        minHeight: 128
    }
}))

const StyledAppBar = styled(AppBar)(({theme}) => ({
    transition: theme.transitions.create(['background-color', 'box-shadow'])
}))

function ElevationScroll(props: { children: ReactElement }) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 4
    })
    return React.cloneElement(props.children, {
        elevation: trigger ? 4 : 0,
        enableColorOnDark: trigger
    })
}

export default function TitleBar() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [settingsOpen, setSettingsOpen] = React.useState(false)

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => setAnchorEl(null)

    const handleSettingsOpen = () => setSettingsOpen(true)
    const handleSettingsClose = () => setSettingsOpen(false)

    return <>
        <SettingsDialog open={settingsOpen} onClose={handleSettingsClose} />
        <Box sx={{ flexGrow: 1 }}>
            <ElevationScroll>
                <StyledAppBar>
                    <StyledToolbar>
                        <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1, alignSelf: 'flex-end' }}>
                            StrikeDistance
                        </Typography>
                        <Tooltip title="Settings">
                            <IconButton onClick={handleSettingsOpen} size="large" aria-label="settings" edge="end" color="inherit">
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="More">
                            <IconButton onClick={handleMenuOpen} size="large" area-controls="menu-appbar" aria-haspopup="true" aria-label="more" edge="end" color="inherit">
                                <MoreIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={!!anchorEl} onClose={handleMenuClose}>
                            <MenuItem onClick={() => window.location.assign('https://gregwhatley.dev')}>
                                <IconButton aria-label="return to gregwhatley.dev" aria-controls="menu-appbar" color="inherit">
                                    <AccountCircle />
                                </IconButton>
                                <p>My Website</p>
                            </MenuItem>
                            <MenuItem onClick={() => window.location.assign('https://github.com/devgregw/strikedistance-web')}>
                                <IconButton aria-label="view source code on GitHub" aria-controls="menu-appbar" color="inherit">
                                    <GitHub />
                                </IconButton>
                                <p>View on GitHub</p>
                            </MenuItem>
                        </Menu>
                    </StyledToolbar>
                </StyledAppBar>
            </ElevationScroll>
            <StyledToolbar />
        </Box>
    </>
}