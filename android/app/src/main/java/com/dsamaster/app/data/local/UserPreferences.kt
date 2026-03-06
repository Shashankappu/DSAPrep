package com.dsamaster.app.data.local

import android.content.Context
import android.content.SharedPreferences

class UserPreferences(context: Context) {
    private val prefs: SharedPreferences = 
        context.getSharedPreferences("dsa_master_prefs", Context.MODE_PRIVATE)

    fun getSolvedIds(): Set<Int> {
        return prefs.getStringSet("solved_ids", emptySet())!!.map { it.toInt() }.toSet()
    }

    fun setSolvedIds(ids: Set<Int>) {
        prefs.edit().putStringSet("solved_ids", ids.map { it.toString() }.toSet()).apply()
    }

    fun getBookmarkedIds(): Set<Int> {
        return prefs.getStringSet("bookmarked_ids", emptySet())!!.map { it.toInt() }.toSet()
    }

    fun setBookmarkedIds(ids: Set<Int>) {
        prefs.edit().putStringSet("bookmarked_ids", ids.map { it.toString() }.toSet()).apply()
    }

    fun isDarkTheme(): Boolean = prefs.getBoolean("dark_theme", true)

    fun setDarkTheme(dark: Boolean) {
        prefs.edit().putBoolean("dark_theme", dark).apply()
    }
}
