package com.moong.cache;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CacheResult <T> {

    private final T data;
    private final CacheStatus status;
    private final long remainingTtl;

    public CacheResult(CacheStatus status) {
        this(
                null,
                status,
                0L
        );
    }

    public boolean isError() {
        return status == CacheStatus.ERROR;
    }

    public boolean isEmpty() {
        return status == CacheStatus.EMPTY;
    }

    public boolean isSafeToRefresh(long refreshThreshold) {
        return remainingTtl > refreshThreshold;
    }

    public boolean isStale(long softTtl) {
        return remainingTtl < softTtl;
    }
}
