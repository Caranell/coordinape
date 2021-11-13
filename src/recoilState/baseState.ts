// at 5k elements for filter-map-slice itiriri is more performant
import iti from 'itiriri';
import { DateTime } from 'luxon';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilValue,
  useRecoilCallback,
  RecoilValueReadOnly,
} from 'recoil';

import { mergeSelfIdProfileInfo } from '../utils/selfIdHelpers';
// import { getApiService } from 'services/api';
// import {
//   createCircleWithDefaults,
//   createGiftWithUser,
//   createExtendedEpoch,
// } from 'utils/modelExtenders';
import storage from 'utils/storage';
import { neverEndingPromise } from 'utils/tools';

import {
  IUser,
  IMyUser,
  IProfile,
  IEpoch,
  ICircle,
  ITokenGift,
  ISelfIdProfile,
  INominee,
  IApiFilledProfile,
} from 'types';

export const useBaseState = () => {
  // const fetchCircleCallback =

  const logout = useRecoilCallback(({ snapshot, set }) => async () => {
    // eslint-disable-next-line no-console
    console.log(snapshot, set);
  });

  const fetchManifest = useRecoilCallback(({ snapshot, set }) => async () => {
    const circleIdState = snapshot.getLoadable(rSelectedCircleId);
    const circleId =
      circleIdState.state === 'hasValue' ? circleIdState.contents : undefined;
    // eslint-disable-next-line no-console
    console.log(circleId, set);
    // Here
  });

  const fetchCircle = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ circleId }: { circleId: number; selectCircle?: boolean }) => {
        // eslint-disable-next-line no-console
        console.log(circleId, snapshot, set);
      }
  );

  const selectCircle = useRecoilCallback(
    ({ snapshot, set }) =>
      async (circleId: number) => {
        // eslint-disable-next-line no-console
        console.log(circleId, snapshot, set);

        // TODO: Make sure this is a valid operation, rather than crash
      }
  );

  return {
    fetchManifest,
    fetchCircle,
    selectCircle,
    selectAndFetchCircle: (circleId: number) =>
      fetchCircle({ circleId, selectCircle: true }),
    logout,
  };
};

/*
 *
 * TODO: Make sure atoms have the right keys
 * TODO: move error boundary so that Header is protected
 * TODO: reset the selectedCircleId?
 * TODO: Have admin view w/ impersonation
 * TODO: Cleanup allocationState
 *********/

//
//
// #region Controls
export const rSelectedCircleId = atom<number>({
  key: 'rSelectedCircleId',
  default: storage.getCircleId() ?? neverEndingPromise(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(newId => {
        if (newId === undefined) {
          storage.clearCircleId();
        } else {
          storage.setCircleId(newId as number);
        }
      });
    },
  ],
});

//#endregion

// Base Atoms
//
// #region
export const rFetchedAt = atomFamily<Map<string, number>, string>({
  key: 'rFetchedAt',
  default: new Map(),
});

export const rSelfIdProfiles = atom<Map<string, ISelfIdProfile>>({
  key: 'rSelfIdProfiles',
  default: new Map(),
});

export const rMyProfile = atom<IProfile>({
  key: 'rMyProfile',
  default: neverEndingPromise(),
});

export const rMyUsers = atom<IMyUser[]>({
  key: 'rMyUsers',
  default: neverEndingPromise(),
});

// TODO: put rMyUsers teammates in it's own atom?

export const rProfileMap = atom<Map<string, IApiFilledProfile>>({
  key: 'rProfileRaw',
  default: neverEndingPromise(),
});

export const rCirclesMap = atom<Map<number, ICircle>>({
  key: 'rCirclesMap',
  default: neverEndingPromise(),
});

export const rEpochsMap = atom<Map<number, IEpoch>>({
  key: 'rEpochsMap',
  default: neverEndingPromise(),
});

export const rNomineesMap = atom<Map<number, INominee>>({
  key: 'rNomineesMap',
  default: neverEndingPromise(),
});

export const rUsersMapRaw = atom<Map<number, IUser>>({
  key: 'rUsersMapRaw',
  default: neverEndingPromise(),
});

export const rPastGiftsMap = atom<Map<number, ITokenGift>>({
  key: 'rPastGiftsMap',
  default: neverEndingPromise(),
});

export const rPendingGiftsMap = atom<Map<number, ITokenGift>>({
  key: 'rPendingGiftsMap',
  default: neverEndingPromise(),
});
//#endregion

// Base Selectors
//
// #region
export const rUsersMap = selector({
  key: 'rUsersMap',
  get: async ({ get }) => {
    const usersMapRaw = new Map(get(rUsersMapRaw));
    const selfIdProfiles = get(rSelfIdProfiles);
    // Profile may have updated fields missing from last we queried users.
    const profileMap = get(rProfileMap);

    iti(usersMapRaw.values()).forEach(u => {
      const existingProfile = profileMap.get(u.address);
      usersMapRaw.set(u.id, {
        ...u,
        // TODO: In the future, profile being defined should be invariant
        // However the server has returned undefined here.
        profile: u.profile
          ? mergeSelfIdProfileInfo(
              existingProfile
                ? {
                    ...u.profile,
                    ...existingProfile,
                  }
                : u.profile,
              selfIdProfiles.get(u.address)
            )
          : undefined,
      });
    });
    return usersMapRaw;
  },
});

export const rGiftsMap = selector({
  key: 'rGiftsMap',
  get: ({ get }) =>
    iti(get(rPendingGiftsMap).values())
      // Yes, this is a bit whacky, in the future merge these tables.
      .map(g => ({ ...g, id: g.id + 1000000000000000 } as ITokenGift))
      .concat(get(rPastGiftsMap).values())
      .toMap(g => g.id),
});
//#endregion

// Selectors
//
// #region
export const rProfileState = selector({
  key: 'rProfileState',
  get: ({ get }) => {
    const hasAdminView = get(rHasAdminView);
    const myUsers = get(rMyUsers);
    const myProfile = get(rMyProfile);

    return {
      myProfile,
      hasAdminView,
      myUsers,
    };
  },
});

export const rCirclesState = selector({
  key: 'rCirclesState',
  get: ({ get }) => {
    const allCircles = Array.from(get(rCirclesMap).values());
    const myCircles = get(rMyUsers).map(u => u.circle);
    const myCirclesSet = new Set(myCircles.map(c => c.id));
    const viewOnlyCircles = allCircles.filter(c => !myCirclesSet.has(c.id));

    return {
      myCircles,
      allCircles,
      viewOnlyCircles,
    };
  },
});

type ExtractRecoilType<P> = P extends (a: any) => RecoilValueReadOnly<infer T>
  ? T
  : never;

interface ICircleState {
  circle: ICircle;
  myUser: IMyUser;
  impersonate: boolean;
  users: IUser[];
  usersWithDeleted: IUser[];
  circleEpochsStatus: ExtractRecoilType<typeof rCircleEpochsStatus>;
  activeNominees: INominee[];
}

export const rCircleState = selectorFamily<ICircleState, number>({
  key: 'rCircleState',
  get:
    (circleId: number) =>
    ({ get }) => {
      const circle = get(rCirclesMap).get(circleId);
      const hasAdminView = get(rHasAdminView);
      const circleUsersAll = iti(get(rUsersMap).values()).filter(
        u => u.circle_id === circleId
      );
      const circleUsers = circleUsersAll.filter(u => !u.deleted_at).toArray();
      const me = get(rMyUsers).find(u => u.circle_id === circleId);
      const circleEpochsStatus = get(rCircleEpochsStatus(circleId));
      const activeNominees = iti(get(rCircleNominees(circleId)))
        .filter(n => !n.ended && !n.expired && n.vouchesNeeded > 0)
        .toArray();

      const impersonate = !me && hasAdminView;
      const pretendToBe = impersonate ? circleUsers?.[0] : undefined;

      if (
        me === undefined ||
        pretendToBe === undefined ||
        circle === undefined
      ) {
        return neverEndingPromise();
      }

      return {
        circle,
        myUser: me ?? pretendToBe,
        impersonate,
        users: circleUsers,
        usersWithDeleted: circleUsersAll.toArray(),
        circleEpochsStatus,
        activeNominees,
      };
    },
});

export const rSelectedCircleState = selector({
  key: 'rSelectedCircleState',
  get: ({ get }) => get(rCircleState(get(rSelectedCircleId))),
});

export const rHasAdminView = selector({
  key: 'rHasAdminView',
  get: ({ get }) => !!get(rMyProfile)?.admin_view,
});

export const rCircleEpochs = selectorFamily<IEpoch[], number>({
  key: 'rCircleEpochs',
  get:
    (circleId: number) =>
    ({ get }) => {
      let lastNumber = 1;
      const epochsWithNumber = [] as IEpoch[];
      iti(get(rEpochsMap).values())
        .filter(e => e.circle_id === circleId)
        .sort((a, b) => +new Date(a.start_date) - +new Date(b.start_date))
        .forEach(epoch => {
          lastNumber = epoch.number ?? lastNumber + 1;
          epochsWithNumber.push({ ...epoch, number: lastNumber });
        });

      return epochsWithNumber;
    },
});

export const rCircleEpochsStatus = selectorFamily({
  key: 'rCircleEpochsStatus',
  get:
    (circleId: number) =>
    ({ get }) => {
      const epochs = get(rCircleEpochs(circleId));
      const pastEpochs = epochs.filter(
        epoch => +new Date(epoch.end_date) - +new Date() <= 0
      );
      const futureEpochs = epochs.filter(
        epoch => +new Date(epoch.start_date) - +new Date() >= 0
      );
      const previousEpoch =
        pastEpochs.length > 0 ? pastEpochs[pastEpochs.length - 1] : undefined;
      const nextEpoch = futureEpochs.length > 0 ? futureEpochs[0] : undefined;
      const previousEpochEndedOn =
        previousEpoch &&
        previousEpoch.endDate
          .minus({ seconds: 1 })
          .toLocal()
          .toLocaleString(DateTime.DATE_MED);

      const currentEpoch = epochs.find(
        epoch =>
          +new Date(epoch.start_date) - +new Date() <= 0 &&
          +new Date(epoch.end_date) - +new Date() >= 0
      );

      const closest = currentEpoch ?? nextEpoch;
      const currentEpochNumber = currentEpoch?.number
        ? String(currentEpoch.number)
        : previousEpoch?.number
        ? String(previousEpoch.number + 1)
        : '1';
      let timingMessage = 'Epoch not Scheduled';
      let longTimingMessage = 'Next Epoch not Scheduled';

      if (closest && !closest.started) {
        timingMessage = `Epoch Begins in ${closest.labelUntilStart}`;
        longTimingMessage = `Epoch ${currentEpochNumber} Begins in ${closest.labelUntilStart}`;
      }
      if (closest && closest.started) {
        timingMessage = `Epoch ends in ${closest.labelUntilEnd}`;
        longTimingMessage = `Epoch ${currentEpochNumber} Ends in ${closest.labelUntilEnd}`;
      }

      return {
        epochs,
        pastEpochs,
        previousEpoch,
        currentEpoch,
        nextEpoch,
        futureEpochs,
        previousEpochEndedOn,
        epochIsActive: !!currentEpoch,
        timingMessage,
        longTimingMessage,
      };
    },
});

export const rCircleNominees = selectorFamily({
  key: 'rCircleNominees',
  get:
    (circleId: number) =>
    ({ get }) =>
      iti(get(rNomineesMap).values())
        .filter(n => n.circle_id === circleId)
        .sort(({ expiryDate: a }, { expiryDate: b }) => a.diff(b).milliseconds)
        .toArray(),
});

export const useProfileState = () => useRecoilValue(rProfileState);
export const useCircles = () => useRecoilValue(rCirclesState);

const useSelectedCircleId = () => useRecoilValue(rSelectedCircleId);
export const useCircleState = (id: number) => useRecoilValue(rCircleState(id));
export const useSelectedCircleState = () =>
  useCircleState(useSelectedCircleId());

export const useEpochsStatus = (circleId: number) =>
  useRecoilValue(rCircleEpochsStatus(circleId));
export const useSelectedCircleEpochsStatus = () =>
  useEpochsStatus(useSelectedCircleId());
