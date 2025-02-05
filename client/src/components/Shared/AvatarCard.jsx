import { AvatarGroup, Stack, Avatar } from '@mui/material';
import React from 'react';

const AvatarCard = ({ avatar = [], max = 4 }) => {
 //  console.log("in avatar card ",avatar)
  return (
    <Stack direction={"row"} spacing={10} sx={{ paddingLeft: "0.5rem" , marginRight:"3rem" }}>
      <AvatarGroup max={max}>
        {avatar?.map((a, index) => (
          <Avatar
            key={index}
            src={a}
            alt="Avatar"
            sx={{
              width: "2rem",
              height: "2rem",
              marginLeft: index === 0 ? "0rem" : "0.5rem", 
            }}
          />
        ))}
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
