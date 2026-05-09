'use client'

import { Avatar } from '@/components/ui/Avatar'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useMemo } from 'react'
import { IoLogOutOutline, IoPersonOutline } from 'react-icons/io5'
import { logoutService } from '@/services/authService'
import { useRouter } from 'next/navigation'
import classNames from 'classnames'
import { IUser } from '@/types/user'
import { MdPayments } from 'react-icons/md'

export const UserNavigator = ({ user }: { user: IUser }) => {
  const name = useMemo(() => user?.name || 'User Name', [user])
  const router = useRouter()
  const dropDownItems = [
    {
      name: 'My Account',
      icon: <IoPersonOutline className="w-5 h-5" />,
      disabled: true,
    },
    { isSeparator: true },
    {
      name: 'Buy Reports',
      icon: <MdPayments className="w-5 h-5" />,
      onClick: () => {
        router.push('/billing/buy')
      },
    },
    { isSeparator: true },
    {
      name: 'Logout',
      icon: <IoLogOutOutline className="w-5 h-5" />,
      onClick: async () => {
        await logoutService()
        router.push(process.env.NEXT_PUBLIC_LOGIN_PATH!)
      },
    },
  ]

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        as="div"
        className="flex flex-row items-center gap-2 cursor-pointer text-xl"
      >
        <Avatar name={user?.name || 'User Name'} />
        {name}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Menu.Items
          as="div"
          className="absolute right-0 mt-3 w-56 bg-white shadow-md rounded-lg border border-gray-200 z-10"
        >
          <div className="py-0">
            {dropDownItems.map((item, index) =>
              item.isSeparator ? (
                <hr key={`separator-${index}`} />
              ) : (
                <Menu.Item key={item.name}>
                  <div
                    className={classNames(
                      `flex items-center gap-3 px-4 py-4 w-full text-left  hover:bg-gray-100`,
                      item.disabled
                        ? 'cursor-not-allowed text-gray-400'
                        : 'cursor-pointer text-gray-700',
                    )}
                    onClick={item.disabled ? undefined : item.onClick}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </Menu.Item>
              ),
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
