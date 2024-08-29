import Link from 'next/link'
import React from 'react'

const ReviewNotification = ({notification}) => {
    console.log(notification)
  return ( 
    <div> 
        {(notification.notification_operation == "approve" || notification.notification_operation == "reject") && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  ${notification.notification_operation === "approve"
                ? " !border-l-4 !border-l-green-400 "
                :  " !border-l-4 !border-l-red-400  "} `}>
                Your  <Link href={`/dashboard/reviews/${notification.related_entity_id}`} className=" font-bold">review</Link> has been 
                {notification.notification_operation === "approve"
                ? " approved "
                : notification.notification_operation == "reject"
                ? " rejected "
                : ""} 
                for business  <Link
                href={`/places/category/business/${notification.review.business.id}`} className=" font-bold"
                >
                    {notification.review.business.name}.
                </Link>
            </div>
        )}

 
        {notification.notification_operation == "pending"  && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  !border-l-4 !border-l-yellow-400`}>
                Your  <Link href={`/dashboard/reviews/${notification.related_entity_id}`} className=" font-bold" >review</Link> has been moved to pending state for business <Link href={`/places/category/business/${notification.review.business.id}`} className=" font-bold">{notification.review.business.name}.</Link>
            </div>
        )}

        {notification.notification_operation == "delete"  && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  !border-l-4 !border-l-red-700`}>
                Your review has been deleted for business <Link href={`/places/category/business/${notification.review.business.id}`} className=" font-bold">{notification.review.business.name}.</Link>
            </div>
        )}

        {notification.notification_operation == "admin_update"  && (
            <div  className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-primary`}>
                Your <Link href={`/dashboard/reviews/${notification.related_entity_id}`} className=" font-bold">review</Link> for business <Link href={`/places/category/business/${notification.review.business.id}`} className=" font-bold">{notification.review.business.name}</Link> is <span className="font-bold">updated by admin</span>.
            </div>
        )}

        {notification.notification_operation == "admin_delete"  && (
            <div  className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-red-700`}>
                Your review for business <Link href={`/places/category/business/${notification.review.business.id}`} className=" font-bold">{notification.review.business.name}</Link> is <span className="font-bold">deleted by admin</span>.
            </div>
        )}
 
        {notification.recevier_id == 'admin' && notification.notification_operation == 'add' && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-purple-700`}>
            A new <Link href={`/dashboard/reviews/${notification.related_entity_id}`} className=" font-bold">review</Link> has been added for <Link href={`/places/category/business/${notification.review.business.id}`} className=" font-bold">{notification.review.business.name}.</Link>
            </div>
        )}  

        {notification.recevier_id == 'admin' && notification.notification_operation == 'approve_moderator' && (
            <div className={`bg-white rounded-md border-2 border-gray-200 py-3 pr-2 pl-4 mb-3  $ !border-l-4 !border-l-purple-700`}>
            A <Link href={`/dashboard/reviews/${notification.related_entity_id}`} className=" font-bold">review</Link> for <Link href={`/places/category/business/${notification.review.business.id}`} className=" font-bold">{notification.review.business.name}</Link> is approved by moderator.
            </div>
        )}  
  

        
        </div>
  )
}

export default ReviewNotification