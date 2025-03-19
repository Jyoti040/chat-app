import React, { memo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AvatarCard from './AvatarCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
//import { useTheme } from '@emotion/react';

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat
}) => {
  console.log("in chatitem", newMessageAlert);

  const showNewMessageAlert = !sameSender && newMessageAlert?.count > 0;

  return (
    <Link
      to={`/chat/${_id}`} state={{ avatar: avatar, name }}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      style={{ textDecoration: 'none', color: 'black' }} // Ensures no underline & black text
    >
      <motion.div
        initial={{ opacity: 0, y: '-100%' }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem',
          position: 'relative',
          gap: '1rem',
          backgroundColor: 'unset',
          color: 'white',
          // borderBottom: '1px solid rgb(3, 2, 2)',
        }}
      >
        <AvatarCard avatar={avatar} />
        <Stack>
          <Typography variant="h6" sx={{ color: 'black', textDecoration: 'none' }}>
            {name}
          </Typography>
          {newMessageAlert?.count > 0 && showNewMessageAlert && (
            <Typography variant="body2" sx={{ color: 'theme.palette.text.primary', textDecoration: 'none' }}>
              {newMessageAlert?.count} new messages
            </Typography>
          )}
        </Stack>

        {isOnline && !groupChat && (
          <Box
            sx={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'green',
              position: 'absolute',
              top: '50%',
              right: '1rem',
              transform: 'translateY(-50%)',
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default ChatItem;
