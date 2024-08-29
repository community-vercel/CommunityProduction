import useAuth from "@/hooks/useAuth";
import {
  BanknotesIcon,
  Bars3Icon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon,
  RectangleStackIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import MenuDropDown from "./MenuDropDown";

const Sidebar = ({ openDrawer, setOpenDrawer }) => {
  const auth = useAuth();
  console.log(auth);
  return (
    <aside
      className={`absolute lg:fixed w-10 sm:w-14 md:w-16  lg:w-24 duration-300 lg:bg-white  h-screen transition-all z-30 ${
        openDrawer && "!w-[320px] !fixed shadow-custom bg-white"
      }`}
    >
      <div
        className={`h-24 flex items-center cursor-pointer px-2 sm:px-4 justify-center ${
          openDrawer === true && "justify-between"
        }`}
      >
        <span
          className={`font-extrabold hidden text-2xl ${
            openDrawer === true && "!inline-block"
          }`}
        >
          Places
        </span>
        <Bars3Icon
          className={`h-6 w-6 hover:text-primary ${
            openDrawer === true && "hidden"
          }`}
          onClick={() => setOpenDrawer(!openDrawer)}
        />
        <ChevronLeftIcon
          className={`h-6 w-6 hover:text-primary hidden ${
            openDrawer === true && "!block"
          }`}
          onClick={() => setOpenDrawer(!openDrawer)}
        />
      </div>
      <div
        className={`h-screen bg-[#3D4962] pt-6 px-4 opacity-0 duration-300 lg:opacity-100 ${
          openDrawer && "!opacity-100"
        }`}
      >
        {auth.user && auth.user_meta.role == "super_admin" && (
          <>
            <Link
              href="/favorite"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <HeartIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                Favorites
              </span>
            </Link>

            <Link
              href="/dashboard/users"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <UserIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                Users
              </span>
            </Link>

            <MenuDropDown
              openDrawer={openDrawer}
              text="Business Directory"
              icon={<FolderIcon className={`h-7 w-7 text-primary`} />}
            >
              <ul className="max-w-[200px] mx-auto mb-2 space-y-1">
                <li>
                  <Link
                    href="/dashboard/business"
                    className={`flex relative  py-1 justify-center items-center ${
                      openDrawer === true && "!justify-normal"
                    }`}
                  >
                    <BuildingOfficeIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${
                        openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                      }`}
                    >
                      Businesses
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/categories"
                    className={`flex relative  py-1 justify-center items-center ${
                      openDrawer === true && "!justify-normal"
                    }`}
                  >
                    <RectangleStackIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${
                        openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                      }`}
                    >
                      Categories
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/reviews"
                    className={`flex relative  py-1 justify-center items-center ${
                      openDrawer === true && "!justify-normal"
                    }`}
                  >
                    <CheckBadgeIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${
                        openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                      }`}
                    >
                      Reviews
                    </span>
                  </Link>
                </li>
              </ul>
            </MenuDropDown>

            <Link
              href="/places"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <HomeIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                Welcome Page
              </span>
            </Link>
          </>
        )}

        {auth.user && auth.user_meta.role == "business" && (
          <>
            <Link
              href="/favorite"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <HeartIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                Favorites
              </span>
            </Link>

            <MenuDropDown
              openDrawer={openDrawer}
              text="Business Directory"
              icon={<FolderIcon className={`h-7 w-7 text-primary`} />}
            >
              <ul className="max-w-[200px] mx-auto mb-2 space-y-1">
                <li>
                  <Link
                    href="/dashboard/business"
                    className={`flex relative  py-1 justify-center items-center ${
                      openDrawer === true && "!justify-normal"
                    }`}
                  >
                    <BuildingOfficeIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${
                        openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                      }`}
                    >
                      Businesses
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/categories"
                    className={`flex relative  py-1 justify-center items-center ${
                      openDrawer === true && "!justify-normal"
                    }`}
                  >
                    <RectangleStackIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${
                        openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                      }`}
                    >
                      Categories
                    </span>
                  </Link>
                </li>
              </ul>
            </MenuDropDown>

            <Link
              href="/places"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <HomeIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                Welcome Page
              </span>
            </Link>
          </>
        )}

        {auth.user && auth.user_meta.role == "moderator" && (
          <>
            <Link
              href="/favorite"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <HeartIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                Favorites
              </span>
            </Link>

            <MenuDropDown
              openDrawer={openDrawer}
              text="Business Directory"
              icon={<FolderIcon className={`h-7 w-7 text-primary`} />}
            >
              <ul className="max-w-[200px] mx-auto mb-2 space-y-1">
                <li>
                  <Link
                    href="/dashboard/business"
                    className={`flex relative  py-1 justify-center items-center ${
                      openDrawer === true && "!justify-normal"
                    }`}
                  >
                    <BuildingOfficeIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${
                        openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                      }`}
                    >
                      Businesses
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/categories"
                    className={`flex relative  py-1 justify-center items-center ${
                      openDrawer === true && "!justify-normal"
                    }`}
                  >
                    <RectangleStackIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${
                        openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                      }`}
                    >
                      Categories
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/reviews"
                    className={`flex relative  py-1 justify-center items-center ${
                      openDrawer === true && "!justify-normal"
                    }`}
                  >
                    <CheckBadgeIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${
                        openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                      }`}
                    >
                      Reviews
                    </span>
                  </Link>
                </li>
              </ul>
            </MenuDropDown>

            <Link
              href="/places"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <HomeIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                Welcome Page
              </span>
            </Link>
          </>
        )}

        {auth.user &&
          auth.user_meta.role != "business" &&
          auth.user_meta.role != "super_admin" &&
          auth.user_meta.role != "moderator" && (
            <>
              <Link
                href="/favorite"
                className={`flex relative  py-3 justify-center items-center ${
                  openDrawer === true && "!justify-normal"
                }`}
              >
                <HeartIcon className={`h-7 w-7 text-primary`} />
                <span
                  className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                    openDrawer === true && "!opacity-100 pointer-events-auto"
                  }`}
                >
                  Favorites
                </span>
              </Link>
              <Link
                href="/places"
                className={`flex relative  py-3 justify-center items-center ${
                  openDrawer === true && "!justify-normal"
                }`}
              >
                <HomeIcon className={`h-7 w-7 text-primary`} />
                <span
                  className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                    openDrawer === true && "!opacity-100 pointer-events-auto"
                  }`}
                >
                  Welcome Page
                </span>
              </Link>
              <Link
                href="#"
                className={`flex relative  py-3 justify-center items-center ${
                  openDrawer === true && "!justify-normal"
                }`}
              >
                <UserGroupIcon className={`h-7 w-7 text-primary`} />
                <span
                  className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                    openDrawer === true && "!opacity-100 pointer-events-auto"
                  }`}
                >
                  MishMish Community
                </span>
              </Link>

              <Link
                href="#"
                className={`flex relative  py-3 justify-center items-center ${
                  openDrawer === true && "!justify-normal"
                }`}
              >
                <CalendarIcon className={`h-7 w-7 text-primary`} />
                <span
                  className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                    openDrawer === true && "!opacity-100 pointer-events-auto"
                  }`}
                >
                  Events
                </span>
              </Link>
            </>
          )}

        {!auth.user && (
          <>
            <Link
              href="/places"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <HomeIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                Welcome Page
              </span>
            </Link>
            <Link
              href="#"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <UserGroupIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                MishMish Community
              </span>
            </Link>

            <Link
              href="#"
              className={`flex relative  py-3 justify-center items-center ${
                openDrawer === true && "!justify-normal"
              }`}
            >
              <CalendarIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
                  openDrawer === true && "!opacity-100 pointer-events-auto"
                }`}
              >
                Events
              </span>
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
