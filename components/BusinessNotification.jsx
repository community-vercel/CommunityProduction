import Link from 'next/link'
import React from 'react'

const BusinessNotification = ({notification}) => {
  return (
    <div>

        {notification.notification_operation == "approve"  && ( 
            <div  className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3 !border-l-4 !border-l-green-400`} >
                Your business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> has been <span className="font-bold">approved</span>.
            </div>  
        )} 

        {notification.notification_operation == "reject"  && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-red-400`}>
                Your business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> has been <span className="font-bold">rejected</span>.
            </div>
        )}

        {notification.notification_operation == "pending"  && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-yellow-400`}>
                Your business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> has been moved to <span className="font-bold">pending</span> state.
            </div>
        )}

        {notification.notification_operation == "featured"  && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-green-700`}>
                Your business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> has been <span className="font-bold">featured</span>.
            </div>
        )}

        {notification.notification_operation == "unfeatured"  && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-yellow-700`}>
                Your business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> has been <span className="font-bold">unfeatured</span>.
            </div>
        )}

        {notification.notification_operation == "delete"  && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-red-700`}>
                Your business <span className=" font-bold">{notification.business.name}</span> has been <span className="font-bold">deleted</span>.
            </div>
        )}  

        {notification.notification_operation == "admin_update"  && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-primary`}>
                Your business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> is <span className="font-bold">updated by admin</span>.
            </div>
        )}

        {notification.notification_operation == "admin_delete"  && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-red-700`}>
                Your business <span className=" font-bold">{notification.business.name}</span> is <span className="font-bold">deleted by admin</span>.
            </div>
        )}

        {notification.recevier_id == 'admin' && notification.notification_operation == 'user_delete' && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-red-700`}>
            Business <span className=" font-bold">{notification.business.name}</span> is <span className="font-bold">deleted by its owner</span>.
            </div>
        )}

        {notification.recevier_id == 'admin' && notification.notification_operation == 'user_update' && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-primary`}>
                Business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> is <span className="font-bold">updated by its owner</span>.
            </div>
        )}

        {notification.recevier_id == 'admin' && notification.notification_operation == 'add' && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-purple-700`}>
            A new business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> has been added.
            </div>
        )}

        {notification.recevier_id == 'admin' && notification.notification_operation == 'featured_moderator' && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-primary`}>
                Business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> is <span className="font-bold">featured by a moderator</span>.
            </div>
        )}

        {notification.recevier_id == 'admin' && notification.notification_operation == 'approve_moderator' && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-purple-700`}>
                Business <Link href={`/places/category/business/${notification.related_entity_id}`} className=" font-bold">{notification.business.name}</Link> is <span className="font-bold">approved by a moderator</span>.
            </div>
        )}
        </div>
  )
}

export default BusinessNotification