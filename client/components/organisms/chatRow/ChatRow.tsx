import classnames from 'classnames';
import { chatRowType } from './chatRowType';
import Cookie from 'js-cookie';

const ChatRow = ({ thumbSrc, nickName, message, createDate, unreadCount }: chatRowType) => {
  const MY_CHAT = Cookie.get('nickName') === nickName;
  const OTHER_CHAT = !MY_CHAT;

  return (
    <div
      className={classnames('mt-[1.625rem] first:mt-0', {
        'flex flex-row-reverse': MY_CHAT,
      })}
    >
      <div
        className={classnames('flex items-start max-w-[31.25rem]', {
          'flex-row-reverse': MY_CHAT,
        })}
      >
        {OTHER_CHAT && thumbSrc && (
          <span className="min-w-[2.8125rem] h-[2.8125rem] rounded-full overflow-hidden">
            <img
              src={thumbSrc}
              alt=""
              className="block w-full h-full object-cover"
            />
          </span>
        )}

        <span
          className={classnames('inline-flex flex-col mx-[0.75rem]', {
            'mr-[0.75rem]': MY_CHAT,
          })}
        >
          {OTHER_CHAT && (
            <span className="block text-[#fefefe] my-[0.375rem]">
              {nickName}
            </span>
          )}
          <span
            className={classnames(
              'inline-flex pt-[0.812rem] pb-[0.875rem] px-[1rem] rounded leading-[1.125rem] break-all',
              { 'bg-[#fff]': OTHER_CHAT },
              { 'bg-[#faff00] ': MY_CHAT }
            )}
          >
            {message}
          </span>
        </span>
        <span className="min-w-[4rem] text-[0.75rem] leading-[0.875rem] text-[#fff] self-end pb-[0.0625rem]">
          {createDate}
        </span>
        {unreadCount !== 0 && 
        <span className="mx-3 text-[0.75rem] leading-[0.875rem] text-[#333] self-end pb-[0.0625rem]">
          {unreadCount}
        </span>}
      </div>
    </div>
  );
};

export default ChatRow;
