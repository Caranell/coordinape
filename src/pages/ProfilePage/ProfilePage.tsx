/* eslint-disable import/order */
import React, { useState, useEffect } from 'react';

import clsx from 'clsx';
import { RouteComponentProps } from 'react-router-dom';

import {
  Dialog,
  makeStyles,
  withStyles,
  Tooltip,
  Zoom,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ShowMore from 'react-show-more';

import discord from '../../assets/svgs/social/discord.svg';
import github from '../../assets/svgs/social/github.svg';
import medium from '../../assets/svgs/social/medium.svg';
import telegram from '../../assets/svgs/social/telegram-icon.svg';
import twitter from '../../assets/svgs/social/twitter-icon.svg';
import website from '../../assets/svgs/social/website.svg';
import { ApeAvatar } from 'components';
import { useProfile, useMe, useCircle } from 'hooks';

import { IApiUser } from 'types';

import { getAvatarPath } from 'utils/domain';
import { transparentize } from 'polished';

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef<unknown, TransitionProps>(
  (props: any, ref) => <Slide direction="up" ref={ref} {...props} />
);

const skillsDumyData = [
  { id: 0, name: 'Community Mgmt' },
  { id: 1, name: 'Discord' },
  { id: 2, name: 'Social Media' },
  { id: 3, name: 'Governance' },
  { id: 4, name: 'Budget Mgmt' },
  { id: 5, name: 'Compensation' },
  { id: 6, name: 'Grants' },
  { id: 7, name: 'Solidity' },
  { id: 8, name: 'Web3' },
  { id: 9, name: 'Front End' },
  { id: 10, name: 'Back End' },
  { id: 11, name: 'UX' },
  { id: 12, name: 'UI' },
  { id: 13, name: 'Product Design' },
  { id: 14, name: 'Full-Stack' },
  { id: 15, name: 'Dev Ops' },
  { id: 16, name: 'Project Mgmt' },
  { id: 17, name: 'Security' },
  { id: 18, name: 'Memes' },
  { id: 19, name: 'Art' },
  { id: 20, name: 'NFTs' },
  { id: 21, name: 'Graphics' },
  { id: 22, name: 'Branding' },
  { id: 23, name: '3D' },
  { id: 24, name: 'Video' },
  { id: 25, name: 'Communications' },
  { id: 26, name: 'Translation' },
  { id: 27, name: 'Docs' },
  { id: 28, name: 'Writing' },
  { id: 29, name: 'Podcasting' },
  { id: 30, name: 'Strategy' },
  { id: 31, name: 'Treasury Mgmt' },
  { id: 32, name: 'Contract Audits' },
  { id: 33, name: 'Multisig' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // maxWidth: theme.breakpoints.values.md,
  },
  main: {
    padding: theme.spacing(4, 5.5),
  },
  body: {
    padding: '0px 145px',
  },
  button: {
    padding: theme.spacing(0.5, 2.5),
    color: theme.colors.text,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    border: '0.3px solid rgba(132, 145, 149, 0.2)',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.12)',
    borderRadius: 8,
    textTransform: 'none',
  },
  background: {
    width: '100%',
    height: 240,
  },
  avatar: {
    width: 143,
    height: 143,
    left: 120,
    top: 90,
  },
  skillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  skillItem: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5, 2),
    background: theme.colors.lightBlue,
    textAlign: 'center',
    fontFamily: 'Space Grotesk',
    fontSize: 18,
    fontWeight: 600,
    color: theme.colors.white,
    borderRadius: 4,
  },
  skillGroupButton: {
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    backgroundColor: theme.colors.lightBlue,
    color: theme.colors.white,
    height: '22.97px',
    borderRadius: 4,
    textTransform: 'none',
    whiteSpace: 'nowrap',
  },
  socialGroup: {
    padding: theme.spacing(3, 0),
    display: 'flex',
    alignItems: 'center',
  },
  gridTitle: {
    borderBottom: '1px solid rgba(81, 99, 105, 0.33)',
    padding: '17px 48px',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 600,
    color: theme.colors.text,
  },
  iconGroup: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 54,
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  gridItem: {
    textAlign: 'center',
    paddingTop: 54,
  },
  recentEpochContainer: {
    maxHeight: 300,
    overflowY: 'scroll',
    scroll: 'smooth',
  },
  collaborators: {
    border: '0.7px solid #939EA1',
    width: 60,
    height: 60,
    marginRight: 16,
  },
  collaboratorsGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalWrapper: {
    width: '100%',
    maxWidth: 1100,
    textAlign: 'center',
    background: theme.colors.white,
  },
  modalBody: {
    padding: '0px 116px',
    marginBottom: 32,
  },
  modalProfileSection: {
    padding: '12px 0px',
  },
  modalSkillsSection: {
    padding: '12px 0px',
    paddingTop: 65,
  },
  modalBiographySection: {
    padding: '12px 0px',
  },
  modalLinksSection: {
    padding: '12px 0px',
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: transparentize(0.3, theme.colors.text),
    padding: '8px 48px',
    borderBottom: '0.7px solid rgba(24, 24, 24, 0.1)',
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalSkillsBody: {
    padding: '32px 0px',
  },
  skillOption: {
    color: theme.colors.white,
    background: transparentize(0.67, theme.colors.text),
    borderRadius: 4,
    padding: '5px 16px',
    marginBottom: 8,
    marginRight: 8,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
      background: theme.colors.mediumGray,
      boxShadow: 'none',
    },
    '&.selected': {
      background: theme.colors.lightBlue,
    },
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    paddingBottom: 16,
  },
  linkButton: {
    background: theme.colors.lightBackground,
    borderRadius: 8,
    textTransform: 'none',
    fontSize: 15,
    color: theme.colors.text,
    marginTop: 8,
    boxShadow: 'none',
  },
  saveButton: {
    background: theme.colors.red,
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.12)',
    borderRadius: 8,
    color: theme.colors.white,
    padding: '8px 16px',
    textTransform: 'none',
    marginTop: 48,
  },
  bioTextarea: {
    height: 143,
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    minHeight: 143,
    margin: theme.spacing(2, 0, 8),
    padding: theme.spacing(3),
    resize: 'vertical',
    fontSize: 20,
    fontWeight: 300,
    color: theme.colors.text,
    border: 0,
    outline: 'none',
    background: theme.colors.lightBackground,
    borderRadius: 8,
    wordBreak: 'break-word',
    '&::placeholder': {
      opacity: 0.3,
    },
  },
  linksText: {
    padding: theme.spacing(1.5, 2),
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    resize: 'none',
    fontFamily: 'Space Grotesk',
    fontSize: 15,
    fontWeight: 300,
    color: theme.colors.text,
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    background: theme.colors.lightBackground,
    borderRadius: 8,
    wordBreak: 'break-word',
    textAlign: 'center',
    alignItems: 'center',
    '&::placeholder': {
      color: '#99A2A5',
    },
  },
  uploadImageContainer: {
    position: 'relative',
    width: 96,
    height: 96,
    margin: 'auto',
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
    marginTop: 16,
    '&:after': {
      content: `" "`,
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      borderRadius: '50%',
      background: transparentize(0.4, theme.colors.black),
      opacity: 0.7,
      transition: 'all 0.5s',
      '-webkit-transition': 'all 0.5s',
    },
    '&:hover': {
      '&:after': {
        opacity: 1,
      },
      '& .upload-image-icon': {
        background: transparentize(0.1, theme.colors.text),
      },
    },
  },
  uploadImageIconWrapper: {
    position: 'absolute',
    marginTop: theme.spacing(1),
    left: 'calc(1% - 40px)',
    width: 178,
    height: 40,
    borderRadius: 8,
    background: transparentize(0.3, theme.colors.text),
    cursor: 'pointer',
    zIndex: 2,
  },
  editAvatar: {
    width: 96,
    height: 96,
    border: '4px solid #FFFFFF',
    borderRadius: '50%',
  },
  recentEpoch: {
    fontSize: 18,
    color: theme.colors.text,
  },
  bioBox: {
    fontSize: 24,
    color: theme.colors.text,
    paddingBottom: 48,
    whiteSpace: 'pre-wrap',
  },
  bioBoxAnchor: {
    fontSize: 22,
    color: theme.colors.selected,
  },
}));

const TextOnlyTooltip = withStyles({
  tooltip: {
    margin: 'auto',
    padding: `4px 8px`,
    maxWidth: 240,
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.5)',
    background: '#C3CDCF',
  },
})(Tooltip);

interface IProfileData {
  avatar: string;
  avatarRaw: File | null;
  background: string;
  backgroundRaw: File | null;
  name: string;
  bio: string;
  telegram_username: string;
  twitter_username: string;
  discord_username: string;
  medium_username: string;
  github_username: string;
  website: string;
  skills: string[];
  users: IApiUser[];
}

// http://app.localhost:3000/profile/0xb9209ed68a702e25e738ca0e550b4a560bf4d9d8
// http://app.localhost:3000/profile/me
export const ProfilePage = ({
  match: { params },
}: RouteComponentProps<{ profileAddress?: string }>) => {
  const classes = useStyles();

  // Circle
  const { selectedCircleId } = useCircle();

  // My or Other Profile
  const seemsAddress = params?.profileAddress?.startsWith('0x');
  const isMe = params?.profileAddress === 'me';
  const { profile, avatarPath, backgroundPath } = useProfile(
    seemsAddress ? params?.profileAddress : undefined
  );
  const {
    myProfile,
    updateProfile: updateMyProfile,
    updateAvatar,
    updateBackground,
    avatarPath: myAvatarPath,
    backgroundPath: myBackgroundPath,
  } = useMe();

  const [open, setOpenModal] = useState(false);

  // Show Profile Data
  const savedProfileData = {
    avatar: isMe ? myAvatarPath : avatarPath,
    avatarRaw: null,
    background: isMe ? myBackgroundPath : backgroundPath,
    backgroundRaw: null,
    name:
      (isMe
        ? myProfile?.users.find((user) => user.circle_id === selectedCircleId)
            ?.name
        : profile?.users.find((user) => user.circle_id === selectedCircleId)
            ?.name) || 'N/A',
    bio: (isMe ? myProfile?.bio : profile?.bio) || '',
    telegram_username:
      (isMe ? myProfile?.telegram_username : profile?.telegram_username) || '',
    twitter_username:
      (isMe ? myProfile?.twitter_username : profile?.twitter_username) || '',
    discord_username:
      (isMe ? myProfile?.discord_username : profile?.discord_username) || '',
    medium_username:
      (isMe ? myProfile?.medium_username : profile?.medium_username) || '',
    github_username:
      (isMe ? myProfile?.github_username : profile?.github_username) || '',
    website: (isMe ? myProfile?.website : profile?.website) || '',
    skills: (isMe ? myProfile?.skills : profile?.skills) || [],
    users: (isMe ? myProfile?.users : profile?.users) || [],
    recentEpochs: isMe
      ? myProfile?.users.map((user) => {
          return {
            epochBio: user.bio?.length > 0 ? user.bio : 'N/A',
            epochCircle: user.circle?.name,
          };
        })
      : profile?.users.map((user) => {
          return {
            epochBio: user.bio?.length > 0 ? user.bio : 'N/A',
            epochCircle: user.circle?.name,
          };
        }),
  };

  // Edit Profile Data
  const [profileData, setProfileData] = useState<IProfileData>({
    avatar: isMe ? myAvatarPath : avatarPath,
    avatarRaw: null,
    background: isMe ? myBackgroundPath : backgroundPath,
    backgroundRaw: null,
    name:
      (isMe
        ? myProfile?.users.find((user) => user.circle_id === selectedCircleId)
            ?.name
        : profile?.users.find((user) => user.circle_id === selectedCircleId)
            ?.name) || 'N/A',
    bio: (isMe ? myProfile?.bio : profile?.bio) || '',
    telegram_username:
      (isMe ? myProfile?.telegram_username : profile?.telegram_username) || '',
    twitter_username:
      (isMe ? myProfile?.twitter_username : profile?.twitter_username) || '',
    discord_username:
      (isMe ? myProfile?.discord_username : profile?.discord_username) || '',
    medium_username:
      (isMe ? myProfile?.medium_username : profile?.medium_username) || '',
    github_username:
      (isMe ? myProfile?.github_username : profile?.github_username) || '',
    website: (isMe ? myProfile?.website : profile?.website) || '',
    skills: (isMe ? myProfile?.skills : profile?.skills) || [],
    users: (isMe ? myProfile?.users : profile?.users) || [],
  });

  const updateSomething = async () => {
    if (isMe) {
      if (profileData.avatarRaw) {
        await updateAvatar(profileData.avatarRaw);
        setProfileData({
          ...profileData,
          avatarRaw: null,
        });
      }

      if (
        savedProfileData.bio !== profileData.bio ||
        savedProfileData.skills !== profileData.skills ||
        savedProfileData.twitter_username !== profileData.twitter_username ||
        savedProfileData.github_username !== profileData.github_username ||
        savedProfileData.telegram_username !== profileData.telegram_username ||
        savedProfileData.discord_username !== profileData.discord_username ||
        savedProfileData.medium_username !== profileData.medium_username ||
        savedProfileData.website !== profileData.website
      ) {
        updateMyProfile({
          bio: profileData.bio,
          skills: profileData.skills,
          twitter_username: profileData.twitter_username,
          github_username: profileData.github_username,
          telegram_username: profileData.telegram_username,
          discord_username: profileData.discord_username,
          medium_username: profileData.medium_username,
          website: profileData.website,
        });
      }
    }
  };

  const openModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const selectSkills = (skill: string) => {
    let skills: string[] = [];
    profileData.skills.forEach((a) => skills.push(a));
    if (skills.includes(skill))
      skills = skills.filter((item) => item !== skill);
    else skills.push(skill);
    const obj = { ...profileData, skills: [...skills] };
    setProfileData(obj);
  };

  const onChangeBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setProfileData({
        ...profileData,
        background: URL.createObjectURL(e.target.files[0]),
        backgroundRaw: e.target.files[0],
      });

      await updateBackground(e.target.files[0]);
    }
  };

  const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setProfileData({
        ...profileData,
        avatar: URL.createObjectURL(e.target.files[0]),
        avatarRaw: e.target.files[0],
      });
    }
  };

  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, bio: e.target.value });
  };

  const onChangeTwitter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, twitter_username: e.target.value });
  };

  const onChangeTelegram = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, telegram_username: e.target.value });
  };

  const onChangeGithub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, github_username: e.target.value });
  };

  const onChangeMedium = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, medium_username: e.target.value });
  };

  const onChangeWebsite = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, website: e.target.value });
  };

  const onChangeDiscord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, discord_username: e.target.value });
  };

  useEffect(() => {
    if (open === true) {
      setProfileData({
        ...profileData,
        avatar: isMe ? myAvatarPath : avatarPath,
        avatarRaw: null,
        background: isMe ? myBackgroundPath : backgroundPath,
        backgroundRaw: null,
        name:
          (isMe
            ? myProfile?.users.find(
                (user) => user.circle_id === selectedCircleId
              )?.name
            : profile?.users.find((user) => user.circle_id === selectedCircleId)
                ?.name) || 'N/A',
        bio: (isMe ? myProfile?.bio : profile?.bio) || '',
        telegram_username:
          (isMe ? myProfile?.telegram_username : profile?.telegram_username) ||
          '',
        twitter_username:
          (isMe ? myProfile?.twitter_username : profile?.twitter_username) ||
          '',
        discord_username:
          (isMe ? myProfile?.discord_username : profile?.discord_username) ||
          '',
        medium_username:
          (isMe ? myProfile?.medium_username : profile?.medium_username) || '',
        github_username:
          (isMe ? myProfile?.github_username : profile?.github_username) || '',
        website: (isMe ? myProfile?.website : profile?.website) || '',
        skills: (isMe ? myProfile?.skills : profile?.skills) || [],
        users: (isMe ? myProfile?.users : profile?.users) || [],
      });
    }
  }, [open]);

  return (
    <div className={classes.root}>
      <img
        alt="background"
        src={savedProfileData?.background}
        className={classes.background}
      />
      <Box
        style={{
          width: '100%',
          marginTop: -240,
        }}
      >
        <div className={classes.main}>
          {isMe ? (
            <Box style={{ textAlign: 'right' }}>
              <input
                id="upload-background-button"
                onChange={onChangeBackground}
                style={{ display: 'none' }}
                type="file"
              />
              <label htmlFor="upload-background-button">
                <Button
                  component="span"
                  variant="contained"
                  color="default"
                  className={classes.button}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Background
                </Button>
              </label>
            </Box>
          ) : (
            <Box style={{ textAlign: 'right', paddingTop: 34 }}></Box>
          )}
          <Avatar
            alt="avatar"
            src={
              savedProfileData?.avatar !== null
                ? savedProfileData?.avatar
                : '/imgs/avatar/placeholder.jpg'
            }
            className={classes.avatar}
          />
          {isMe ? (
            <Box style={{ textAlign: 'right', paddingTop: 45 }}>
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<EditOutlinedIcon />}
                onClick={openModal}
              >
                Edit Profile
              </Button>
            </Box>
          ) : (
            <Box style={{ textAlign: 'right', paddingTop: 100 }}></Box>
          )}
          <Box className={classes.body}>
            <h2
              style={{
                marginTop: 18,
                marginBottom: 12,
                fontSize: 30,
                fontWeight: 600,
                fontFamily: 'Space Grotesk',
                color: '#5E6F74',
              }}
            >
              {savedProfileData.name}
            </h2>
            <Box className={classes.skillGroup}>
              {/* loop section from the myprofile data */}
              {savedProfileData?.skills?.length
                ? savedProfileData?.skills.map((item) => (
                    <div key={item} className={classes.skillItem}>
                      {item}
                    </div>
                  ))
                : ''}
            </Box>
            <Box className={classes.socialGroup}>
              {savedProfileData?.twitter_username && (
                <Link
                  href={`https://twitter.com/${savedProfileData?.twitter_username}`}
                  target="_blank"
                >
                  <img
                    alt="twitter"
                    src={twitter}
                    style={{ paddingRight: 16 }}
                  />
                </Link>
              )}
              {savedProfileData?.github_username && (
                <Link
                  href={`https://github.com/${savedProfileData?.github_username}`}
                  target="_blank"
                >
                  <img alt="github" src={github} style={{ paddingRight: 16 }} />
                </Link>
              )}
              {savedProfileData?.telegram_username && (
                <Link
                  href={`https://t.me/${savedProfileData?.telegram_username}`}
                  target="_blank"
                >
                  <img
                    alt="telegram"
                    src={telegram}
                    style={{ paddingRight: 16 }}
                  />
                </Link>
              )}
              {savedProfileData?.discord_username && (
                <Link
                  href={`https://discord.com/${savedProfileData?.discord_username}`}
                  target="_blank"
                >
                  <img
                    alt="discord"
                    src={discord}
                    style={{
                      paddingRight: 16,
                      width: 50,
                      height: 50,
                    }}
                  />
                </Link>
              )}
              {savedProfileData?.medium_username && (
                <Link
                  href={`https://medium.com/${savedProfileData?.medium_username}`}
                  target="_blank"
                >
                  <img
                    alt="medium"
                    src={medium}
                    style={{ paddingRight: 16, width: 50, height: 50 }}
                  />
                </Link>
              )}
              {savedProfileData?.website && (
                <Link
                  style={{ color: 'rgba(81, 99, 105, 0.7)', paddingRight: 16 }}
                  href={savedProfileData?.website}
                  target="_blank"
                >
                  <img
                    alt="website"
                    src={website}
                    style={{ paddingRight: 16, width: 50, height: 50 }}
                  />
                </Link>
              )}
            </Box>
            <Box className={classes.bioBox}>
              <ShowMore anchorClass={classes.bioBoxAnchor}>
                {savedProfileData?.bio}
              </ShowMore>
            </Box>
            <Grid container spacing={10}>
              <Grid item sm={6} xs={12}>
                <Box className={classes.gridTitle}>
                  {isMe ? 'My Circles' : 'Circles'}
                </Box>
                <Box className={classes.iconGroup}>
                  {savedProfileData?.users.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        textAlign: 'center',
                        marginLeft: 13,
                        marginRight: 13,
                      }}
                    >
                      <TextOnlyTooltip
                        TransitionComponent={Zoom}
                        placement="top"
                        title={user.circle?.name || ''}
                      >
                        <Avatar
                          alt={user?.circle?.name}
                          src={getAvatarPath(user.circle?.logo)}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            border: '1px solid rgba(94, 111, 116, 0.7)',
                          }}
                        />
                      </TextOnlyTooltip>
                      {user?.non_receiver !== 0 && (
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'rgba(81, 99, 105, 0.5)',
                          }}
                        >
                          Opted-Out
                        </p>
                      )}
                    </div>
                  ))}
                </Box>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Box className={classes.gridTitle}>Recent Epoch Activity</Box>
                <div className={classes.recentEpochContainer}>
                  {savedProfileData.recentEpochs?.map((epoch, index) => (
                    <Box key={index} className={classes.gridItem}>
                      <Typography
                        style={{ fontWeight: 600 }}
                        className={classes.recentEpoch}
                      >
                        {`Epoch on ${epoch.epochCircle}`}
                      </Typography>
                      <Typography className={classes.recentEpoch}>
                        {epoch.epochBio}
                      </Typography>
                    </Box>
                  ))}
                </div>
              </Grid>
              {/* <Grid item sm={4} xs={12}> */}
              {/* <Box className={classes.gridTitle}>Frequent Collaborators</Box> */}
              {/* <Box className={classes.gridItem}>
                <Box className={classes.collaboratorsGroup}>
                  <Avatar
                    alt="collaborator1"
                    src={
                      myProfile?.avatar !== null
                        ? myProfile?.avatar
                        : '/imgs/avatar/ak.jpeg'
                    }
                    className={classes.collaborators}
                  />
                  <Avatar
                    alt="collaborator1"
                    src={
                      myProfile?.avatar !== null
                        ? myProfile?.avatar
                        : '/imgs/avatar/ak.jpeg'
                    }
                    className={classes.collaborators}
                  />
                </Box>
                <Box className={classes.collaboratorsGroup}>
                  <Avatar
                    alt="collaborator1"
                    src={
                      myProfile?.avatar !== null
                        ? myProfile?.avatar
                        : '/imgs/avatar/ak.jpeg'
                    }
                    className={classes.collaborators}
                  />
                  <Avatar
                    alt="collaborator1"
                    src={
                      myProfile?.avatar !== null
                        ? myProfile?.avatar
                        : '/imgs/avatar/ak.jpeg'
                    }
                    className={classes.collaborators}
                  />
                  <Avatar
                    alt="collaborator1"
                    src={
                      myProfile?.avatar !== null
                        ? myProfile?.avatar
                        : '/imgs/avatar/ak.jpeg'
                    }
                    className={classes.collaborators}
                  />
                </Box>
                <Box className={classes.collaboratorsGroup}>
                  <Avatar
                    alt="collaborator1"
                    src={
                      myProfile?.avatar !== null
                        ? myProfile?.avatar
                        : '/imgs/avatar/ak.jpeg'
                    }
                    className={classes.collaborators}
                  />
                  <Avatar
                    alt="collaborator1"
                    src={
                      myProfile?.avatar !== null
                        ? myProfile?.avatar
                        : '/imgs/avatar/ak.jpeg'
                    }
                    className={classes.collaborators}
                  />
                </Box>
              </Box> */}
              {/* </Grid> */}
            </Grid>
          </Box>
          {/* <div>
          <h2>Other Profile</h2>
          <p>{JSON.stringify(profile)}</p>
        </div>
        <button onClick={updateSomething}>Update?</button> */}
        </div>
      </Box>
      <Dialog
        open={open}
        onClose={closeModal}
        TransitionComponent={Transition}
        classes={{ paper: classes.modalWrapper }}
      >
        <Box
          style={{
            paddingTop: '10px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <h2>Edit Profile</h2>
          <IconButton
            onClick={closeModal}
            aria-label="close"
            style={{
              color: 'rgba(81, 99, 105, 0.35)',
              right: 20,
              position: 'absolute',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box className={classes.modalBody}>
          <Box className={classes.modalProfileSection}>
            <Typography className={classes.modalSubTitle}>
              Profile Image
            </Typography>
            <div className={classes.uploadImageContainer}>
              <label htmlFor="upload-avatar-button">
                <ApeAvatar
                  path={profileData?.avatar}
                  className={classes.editAvatar}
                />
                <div
                  className={clsx(
                    classes.uploadImageIconWrapper,
                    'upload-image-icon'
                  )}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CloudUploadIcon style={{ color: '#FFFFFF' }} />
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#FFFFFF',
                        paddingLeft: 8,
                      }}
                    >
                      Upload Profile Image
                    </p>
                  </div>
                </div>
              </label>
              <input
                id="upload-avatar-button"
                onChange={onChangeAvatar}
                style={{ display: 'none' }}
                type="file"
              />
            </div>
          </Box>
          <Box className={classes.modalSkillsSection}>
            <Box className={classes.modalSubTitle}>Select Your Skills</Box>
            <Box className={classes.modalSkillsBody}>
              {skillsDumyData.map((item) => (
                <Button
                  key={item.name}
                  variant="contained"
                  className={clsx(
                    classes.skillOption,
                    profileData.skills.includes(item.name) ? 'selected' : ''
                  )}
                  onClick={() => selectSkills(item.name)}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          </Box>
          <Box className={classes.modalBiographySection}>
            <Typography className={classes.modalSubTitle}>Biography</Typography>
            <textarea
              className={classes.bioTextarea}
              onChange={onChangeBio}
              value={profileData.bio}
            />
          </Box>
          <Box className={classes.modalLinksSection}>
            <Typography
              className={classes.modalSubTitle}
              style={{ marginBottom: 32 }}
            >
              Links
            </Typography>
            <Grid container spacing={4}>
              <Grid item sm={3} xs={12}>
                <Typography className={classes.linkTitle}>Twitter</Typography>
                <input
                  className={classes.linksText}
                  onChange={onChangeTwitter}
                  value={profileData.twitter_username}
                  placeholder="Enter username"
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Typography className={classes.linkTitle}>Github</Typography>
                <input
                  className={classes.linksText}
                  onChange={onChangeGithub}
                  value={profileData.github_username}
                  placeholder="Enter username"
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Typography className={classes.linkTitle}>Telegram</Typography>
                <input
                  className={classes.linksText}
                  onChange={onChangeTelegram}
                  value={profileData.telegram_username}
                  placeholder="Enter username"
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Typography className={classes.linkTitle}>Discord</Typography>
                <input
                  className={classes.linksText}
                  onChange={onChangeDiscord}
                  value={profileData.discord_username}
                  placeholder="Username#xxxx"
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Typography className={classes.linkTitle}>Medium</Typography>
                <input
                  className={classes.linksText}
                  onChange={onChangeMedium}
                  value={profileData.medium_username}
                  placeholder="Enter username"
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Typography className={classes.linkTitle}>Website</Typography>
                <input
                  className={classes.linksText}
                  onChange={onChangeWebsite}
                  value={profileData.website}
                  placeholder="Enter link"
                />
              </Grid>
            </Grid>
          </Box>
          <Button
            variant="contained"
            color="default"
            className={classes.saveButton}
            startIcon={<SaveOutlinedIcon />}
            onClick={updateSomething}
          >
            Save
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
