setInterval(() => {
    //logger.warn(LastInlineRequest,'\n',to_be_removed)
    for (let from_id in LastInlineRequest) {
        let elapsed_time = new Date().getTime() - LastInlineRequest[from_id]['time_ms'];
        if (elapsed_time > INLINE_SUMMON_DELAY && elapsed_time < TELEGRAM_SUMMON_TIMEOUT && LastInlineRequest[from_id]['status'] === 'unprocessed') {
            LastInlineRequest[from_id]['status'] = 'pending';
            // safe to reply
            logger.warn('inline_query: ', LastInlineRequest[from_id]['query']);

            bot_util.isEasterEgg(LastInlineRequest[from_id]['query']).then((answer) => {
                bot.telegram.answerInlineQuery(LastInlineRequest[from_id]['query_id'], answer).catch((err) => {
                    logger.error('answerInlineQuery failed to send: ', err)
                });
                LastInlineRequest[from_id]['status'] = 'done';
                to_be_removed.push(from_id);
            }).catch(() => {});

            bot_util.isValidBraceSummon(LastInlineRequest[from_id]['query']).then((query) => {
                logger.log('Summon: {', query, '}');
                console.time('execution time');
                //logger.log('q: ', query);
                Searcher.matchFromCache('{' + query + '}').then((result) => {
                    //boo yah
                    bot.telegram.answerInlineQuery(LastInlineRequest[from_id]['query_id'], [buildInlineQueryResultArticleFromAnime(result)]).catch((err) => { logger.error('answerInlineQuery failed to send: ', err) });
                    LastInlineRequest[from_id]['status'] = 'done';
                    to_be_removed.push(from_id);
                    console.timeEnd('execution time');
                }).catch((err) => {
                    logger.warn('cache empty: ', err);
                    //nothing in cache
                    Searcher.matchAnimeFromDatabase(query).then((result) => {
                        //boo yah
                        bot.telegram.answerInlineQuery(LastInlineRequest[from_id]['query_id'], [buildInlineQueryResultArticleFromAnime(result)]).catch((err) => { logger.error('answerInlineQuery failed to send: ', err) });
                        LastInlineRequest[from_id]['status'] = 'done';
                        to_be_removed.push(from_id);
                        console.timeEnd('execution time');
                    }).catch((err) => {
                        logger.warn('database empty: ', err);
                        //nothing in database
                        Searcher.searchAnimes(query).then((result) => {
                            //logger.log(result);
                            bot.telegram.answerInlineQuery(LastInlineRequest[from_id]['query_id'], [buildInlineQueryResultArticleFromAnime(result)]).catch((err) => { logger.error('answerInlineQuery failed to send: ', err) });
                            LastInlineRequest[from_id]['status'] = 'done';
                            to_be_removed.push(from_id);
                            console.timeEnd('execution time');
                        }).catch((r) => {
                            //well that sucks
                            if (r === 'can\'t findBestMatchForAnimeArray if there are no titles') {
                                logger.warn('q: {' + query + '} => ' + filled_x)
                            } else {
                                logger.error('failed to search with Searcher: ', r);
                            }
                            LastInlineRequest[from_id]['status'] = 'done';
                            to_be_removed.push(from_id);
                            console.timeEnd('execution time');
                        });
                    })
                });
            })
        }
        if (elapsed_time > TELEGRAM_SUMMON_TIMEOUT) {
            //stores the user ids of users who cant have their request fullfilled anymore
            logger.warn('to_be_removed ' + from_id + ' due to timeout')
            to_be_removed.push(from_id);
        }
    }
    for (let i = to_be_removed.length - 1; i >= 0; i--) {
        //removes the request info of users who cant have their request fullfilled anymore
        //logger.log(LastInlineRequest,'\n',to_be_removed);
        logger.warn('removing ', to_be_removed[i]);
        delete LastInlineRequest[to_be_removed[i]];
        to_be_removed.splice(i, 1);

    }
}, 100);